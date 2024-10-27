'use client'
import { useUpload } from "@/hook/use-upload-hook";
import { PreviewImage } from "./PreviewImage";
import { ButtonFile } from "./ButtonFile";
import { Dropzone } from "./Dropzone";
import { InputLink } from "./InputLink";
import { ProgressCard } from "./ProgressCard";

export const DisplayCard = () => {
    const upload = useUpload();

    return (
        <div>
			{!upload.isFetching && (
				<div
					{...upload.getRootProps({ className: 'dropzone' })}
					className='w-full sm:w-[402px] h-[469px] p-8 bg-slate-50 sm:bg-white rounded-xl shadow-none sm:shadow-lg sm:shadow-gray-200/80'
				>
					<div className='w-full h-full flex gap-6 flex-col justify-evenly items-center'>
						{upload.isSuccess && <i className='fa-sharp fa-solid fa-circle-check text-4xl text-green-600'></i>}

						<h2 className='text-xl text-gray-600 text-center font-semibold'>
							{upload.isSuccess ? 'Processed Receipts:' : 'Upload your Grocery Receipt'}
						</h2>

						{!upload.isSuccess && (
							<p className='text-xs sm:text-sm text-gray-500 text-center font-medium'>File should be Jpeg, Png, Gif</p>
						)}

						{upload.image ? (
                            upload.image.map((img) => (
                            <PreviewImage key={img.public_id} imageUrl={img.secure_url} />
                        ))	
						) : (
							<Dropzone isActive={upload.isDragActive} onInputProps={upload.getInputProps} />
						)}

						{!upload.isSuccess && <span className='text-xs text-gray-400 font-medium'>Or</span>}

						{!upload.isSuccess && (
							<ButtonFile onClick={() => upload.inputRef.current?.click()} inputRef={upload.inputRef} onChange={upload.onChangeFile} />
						)}

						{upload.isSuccess && upload.image && upload.image.map((img) => (
                            <InputLink key={img.public_id} value={img.secure_url!} />
                        ))}
					</div>
				</div>
			)}

			{upload.isFetching && <ProgressCard progressStatus={upload.progressStatus} />}
		</div>
	);
    
}