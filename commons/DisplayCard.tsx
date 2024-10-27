'use client'
import { useUpload } from "@/hook/use-upload-hook";
import { PreviewImage } from "./PreviewImage";
import { ButtonFile } from "./ButtonFile";
import { Dropzone } from "./Dropzone";
import { InputLink } from "./InputLink";
import { ProgressCard } from "./ProgressCard";

export const DisplayCard = () => {

    const u = useUpload();

    return (
        <div>
			{!u.isFetching && (
				<div
					{...u.getRootProps({ className: 'dropzone' })}
					className='w-full sm:w-[402px] h-[469px] p-8 bg-slate-50 sm:bg-white rounded-xl shadow-none sm:shadow-lg sm:shadow-gray-200/80'
				>
					<div className='w-full h-full flex gap-6 flex-col justify-evenly items-center'>
						{u.isSuccess && <i className='fa-sharp fa-solid fa-circle-check text-4xl text-green-600'></i>}

						<h2 className='text-xl text-gray-600 text-center font-semibold'>
							{u.isSuccess ? 'Uploaded Successfully!' : 'Upload your Grocery Receipt'}
						</h2>

						{!u.isSuccess && (
							<p className='text-xs sm:text-sm text-gray-500 text-center font-medium'>File should be Jpeg, Png, Gif</p>
						)}

						{u.image ? (
                            u.image.map((img) => (
                            <PreviewImage key={img.public_id} imageUrl={img.secure_url} />
                        ))	
						) : (
							<Dropzone isActive={u.isDragActive} onInputProps={u.getInputProps} />
						)}

						{!u.isSuccess && <span className='text-xs text-gray-400 font-medium'>Or</span>}

						{!u.isSuccess && (
							<ButtonFile onClick={() => u.inputRef.current?.click()} inputRef={u.inputRef} onChange={u.onChangeFile} />
						)}

						{u.isSuccess && u.image && u.image.map((img) => (
                            <InputLink key={img.public_id} value={img.secure_url!} />
                        ))}
					</div>
				</div>
			)}

			{u.isFetching && <ProgressCard progressStatus={u.progressStatus} />}
		</div>
	);
    
}