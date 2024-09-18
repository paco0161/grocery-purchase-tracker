'use client'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DROPZONE_OPTIONS } from '@/library/dropzone-option';
import { uploadFile } from '@/library/upload-file-lib';
import { processReceipt } from '@/library/process-receipt';
import { appendSheetData, getSheetData } from '@/library/google-sheet-actions';


type ImageRes = {
	public_id: string;
	secure_url: string;
};

const imageTypeRegex = /image\/(png|gif|jpg|jpeg)/gm;
const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID!
const sheetName = process.env.NEXT_PUBLIC_GOOGLE_SHEET_NAME!

function isMonthNaN(date1Str: string): boolean {
    const date1 = new Date(date1Str);
    const month1 = date1.getMonth();

    return isNaN(month1);
}

function isNextMonth(date1Str: string, date2Str: string): boolean {
    // Parse both date strings into Date objects
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    // Get the year and month for each date
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    console.log(month1)
    
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    console.log(month2)

    if (year1 === year2) {
        return month1 != month2;
    } else if (year1 === year2 + 1 && month1 === 0 && month2 === 11) {
        // Handle year transition, e.g., January 2024 and December 2023
        return true;
    }

    return false;
}

export const useUpload = () => {
	const [formatImage, setFormatImage] = useState<FormData | null>(null);
	const [image, setImage] = useState<ImageRes | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [progressStatus, setProgressStatus] = useState(0);

	const inputRef = useRef<HTMLInputElement>(null);
    
	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (!acceptedFiles.length) return;

		const formData = new FormData();
		formData.append('file', acceptedFiles[0]);
		formData.append('upload_preset', preset);

		setFormatImage(formData);
	}, []);

	const { getRootProps, getInputProps, fileRejections, isDragActive } = useDropzone({ ...DROPZONE_OPTIONS, onDrop });

	const onChangeFile = (e: ChangeEvent<HTMLInputElement>): void => {
		const files = e.target?.files!;

		const formData = new FormData();
		const file = files?.[0];

		if (!file?.type.match(imageTypeRegex)) return;

		formData.append('file', file);
		formData.append('upload_preset', preset);

		setFormatImage(formData);
	};

	useEffect(() => {
		if (fileRejections.length) {
			fileRejections
				.map((el) => el.errors)
				.map((err) => {
					err.map((el) => {
						if (el.code.includes('file-invalid-type')) {
							toast.error('File type must be .png,.jpg,.jpeg,.gif', { theme: 'light' });
							return;
						}
						if (el.code.includes('file-too-large')) {
							toast.error('File is larger than 10MB', { theme: 'light' });
							return;
						}
					});
				});
		}
	}, [fileRejections]);

	useEffect(() => {
		(async () => {
			if (!formatImage) return;

			try {
				setIsFetching(true);
				const data = await uploadFile({
					formData: formatImage,
					onUploadProgress(progress) {
						setProgressStatus(progress);
					},
				});

				if (data) {
					setFormatImage(null);
					setImage(data);
					setIsFetching(false);
					setIsSuccess(true);
				}

                setIsFetching(true);
                const analysis_results = await processReceipt(data.secure_url);

                if (analysis_results) {
                    setIsFetching(false);
					setIsSuccess(true);
                    toast.success('Successfully processed uploaded receipt!');
                }

                setIsFetching(true);
                const table = {
                    'majorDimension': 'ROWS',
                    'values': []
                }
                const empty_result = await appendSheetData(spreadsheetId, sheetName, table);
                const regex = /^.*![A-Z]+\d+:[A-Z]+(\d+)$/;
                const match = empty_result.result.tableRange.match(regex);
                if (match) {
                    const last_row = match[1];
                    const get_last_row = await getSheetData(spreadsheetId, sheetName.concat("!A", last_row, ":ZZ", last_row))
                    const last_transaction_date = get_last_row.result.values.at(0)?.at(0)
                    const current_transaction_date = analysis_results.values.at(0)?.at(0)

                    if (isMonthNaN(last_transaction_date!) || isNextMonth(current_transaction_date!, last_transaction_date!)) {
                        analysis_results.values.unshift([])
                        console.log(analysis_results.values)
                    }
                }

                setIsFetching(true);
                const result = await appendSheetData(spreadsheetId, sheetName, analysis_results);
                
                if (result) {
                    setIsFetching(false);
                    setIsSuccess(true);
					toast.success('Successfully added into google sheet!');
                }

			} catch (err) {
				if (axios.isAxiosError(err)) {
                    toast.error(err.message);
				}
				if (err instanceof Error) {
					toast.error(err.stack);
				}
				setFormatImage(null);
				setImage(null);
				setIsFetching(false);
				setIsSuccess(false);
			}
		})();
	}, [formatImage]);

	return {
		isFetching,
		isDragActive,
		isSuccess,
		image,
		progressStatus,
		inputRef,
		onChangeFile,
		getRootProps,
		getInputProps,
	};
};