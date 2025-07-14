import React from 'react'
import UploadFile from './UploadFile'

function Documents() {
  return (
    <div className='md:px-36'>
        <div>
            <h5 className=' bg-gray-200 p-2 py-3 flex flex-col gap-4 '>
              <span className='text-2xl text-blue-500'>My Documents</span>  
            <UploadFile />
            </h5>
        </div>
    </div>
  )
}

export default Documents