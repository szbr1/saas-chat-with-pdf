'use client'
import { FireExtinguisher, Space, Upload, UploadCloud } from 'lucide-react'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

function page() {
 
  const {getRootProps, getInputProps, isDragActive, isFocused, isDragAccept} = useDropzone()

  return (
    <div className='h-full w-full flex justify-center p-2 py-8 lg:px-24'>
      <div className={`flex max-w-7xl h-60 justify-center items-center py-24  w-full border-1 border-dashed rounded-sm border-blue-500 ${isFocused ||isDragAccept ? "bg-blue-300":""} }`}>
        
      <div className='' {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <div className='flex justify-center items-center flex-col'>
            <span className='text-gray-200'>Drop your Files here.</span>
            <Space className='size-16 animate-bounce text-gray-800 '  /></div> :
          <div className='flex justify-center items-center flex-col' >
            <UploadCloud className=' animate-bounce size-16 text-blue-500' />
            <span className='text-gray-800'>
              Drag your Files 
            </span>
          </div>

      }
    </div>
        
      </div>
    </div>
  )
}

export default page