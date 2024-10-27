import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DROPZONE_OPTIONS } from '@/library/dropzone-option';
import { uploadFile } from '@/library/upload-file-lib';
import { processReceipt } from '@/library/process-receipt';
import { appendSheetData, getSheetData } from '@/library/google-sheet-actions';
import { useProcessReceipt } from './use-process-receipt-hook';

type ImageRes = {
	public_id: string;
	secure_url: string;
};

const imageTypeRegex = /image\/(png|gif|jpg|jpeg)/gm;
const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

export const useUpload = () => {
	const [formatImage, setFormatImage] = useState<FormData[] | null>(null);
	const [image, setImage] = useState<ImageRes[] | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
    const [allImagesUploaded, setAllImagesUploaded] = useState(false);
	const [progressStatus, setProgressStatus] = useState(0);

	const inputRef = useRef<HTMLInputElement>(null);
    
	const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = [...acceptedFiles].filter((file) => file?.type.match(imageTypeRegex))

        if (validFiles.length === 0) {
            toast.error("No valid files to upload on drop", { theme: 'light', autoClose: 10000 })
            return;
        }

        const formDataArray = validFiles.map((file) => {
            const formData = new FormData();
            formData.append('file', acceptedFiles[0]);
            formData.append('upload_preset', preset);
            return formData
        })

        console.log('on drop')

		setFormatImage(formDataArray);
	}, []);

	const { getRootProps, getInputProps, fileRejections, isDragActive } = useDropzone({ ...DROPZONE_OPTIONS, onDrop });

	const onChangeFile = (e: ChangeEvent<HTMLInputElement>): void => {
		const files = e.target?.files!;
        const validFiles = [...files].filter((file) => file?.type.match(imageTypeRegex))

        if (validFiles.length === 0) {
            toast.error("No valid files to upload on change", { theme: 'light', autoClose: 10000 })
            return;
        }

		const formDataArray = validFiles.map((file) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', preset)
            return formData;
        })

		setFormatImage(formDataArray);
	};

	useEffect(() => {
		if (fileRejections.length) {
			fileRejections
				.map((el) => el.errors)
				.map((err) => {
					err.map((el) => {
						if (el.code.includes('file-invalid-type')) {
							toast.error('File type must be .png,.jpg,.jpeg,.gif', { theme: 'light', autoClose: 10000 });
							return;
						}
						if (el.code.includes('file-too-large')) {
							toast.error('File is larger than 10MB', { theme: 'light', autoClose: 10000 });
							return;
						}
					});
				});
		}
	}, [fileRejections]);

    useEffect(() => {
        const uploadImages = async () => {
            if (!formatImage) return;

            setIsFetching(true);
            try {
                const uploadPromises = formatImage.map((formData) =>
                    uploadFile({
                        formData: formData,
                        onUploadProgress: (progress) => setProgressStatus(progress),
                    })
                );
                const dataList = await Promise.all(uploadPromises);

                if (dataList.length > 0) {
                    setFormatImage(null);
                    setImage(dataList);
                    setIsSuccess(true);
                    setAllImagesUploaded(true);
                }
            } catch (err) {
                toast.error("Failed to upload images.", { autoClose: 10000 });
                setFormatImage(null);
                setImage(null);
                setIsSuccess(false);
                setIsFetching(false);
            }
        };

        uploadImages();
    }, [formatImage]);

    useProcessReceipt(image, allImagesUploaded, setIsFetching);

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