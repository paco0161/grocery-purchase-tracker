'use client'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DROPZONE_OPTIONS } from '@/library/dropzone-option';
import { uploadFile } from '@/library/upload-file-lib';
import { processReceipt } from '@/library/process-receipt';
import { appendSheetData } from '@/library/google-sheet-actions';


type ImageRes = {
	public_id: string;
	secure_url: string;
};

const imageTypeRegex = /image\/(png|gif|jpg|jpeg)/gm;
const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

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
					toast.success('Successfully uploaded!');
				}

                setIsFetching(true);
                const analysis_results = await processReceipt(data.secure_url);

                if (analysis_results) {
                    setIsFetching(false);
					setIsSuccess(true);
                    toast.success('Successfully processed uploaded receipt!');
                }

                setIsFetching(true);
                const result = await appendSheetData(analysis_results);
                
                if (result) {
                    setIsFetching(false);
                    setIsSuccess(true);
					toast.success('Successfully get!');
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