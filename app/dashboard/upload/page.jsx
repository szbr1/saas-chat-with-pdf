"use client";
import useUploader from "@/app/hooks/useUploader";
import { File, Hammer, Space, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

function Page() {
  const router = useRouter();
  const { fileId, progress, status, handleUpload } = useUploader();

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length) {
        handleUpload(acceptedFiles[0]);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: { "application/pdf": [".pdf"] },
    });

  const saving = progress > 80 && progress < 100;
  const uploading = progress > 0 && progress <= 45;

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/${fileId}`);
    }
    if (status === "success") {
      toast.success("✅ Successfully uploaded.");
    }
  }, [fileId, router]);

  return (
    <div className="h-full w-full flex justify-center p-2 py-8 lg:px-24">
      {progress > 0 && (
        <div className="flex flex-col justify-center items-center gap-3">
          {uploading && ( 
            <Hammer className="size-16 lg:size-24 text-blue-600 animate-bounce" />
            
          )}
          {progress > 45 && <File className="size-16 lg:size-24 text-green-600 animate-pulse" />}
          {progress ? <span className="py-5 text-gray-500">
            {progress}%
            {status === "success" ? " ✅ Successfully uploaded." : ""}
          </span>:""}
        </div>
      )}

      {progress === 0 && (
        <div
          className={`flex max-w-6xl h-60 justify-center items-center py-24 w-full border-1 border-dashed rounded-sm border-blue-500 ${
            isFocused || isDragAccept ? "bg-blue-300" : "bg-slate-200"
          }`}
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex cursor-pointer justify-center items-center flex-col">
                <span className="text-gray-200">Drop your Files here.</span>
                <Space className="size-16 animate-bounce text-gray-800" />
              </div>
            ) : (
              <div className="flex justify-center cursor-pointer items-center flex-col">
                <UploadCloud className="cursor-pointer animate-bounce size-16 text-blue-500" />
                <span className="text-gray-800">Drag your Files</span>
              </div>
            )}
          </div>
        </div>
      )}

     
    </div>
  );
}

export default Page;
