import { Plus, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function UploadFile() {
  return (
    <Link href={"/dashboard/upload"} className='hover:bg-slate-900 mt-8 bg-slate-300 h-52 shadow-md flex flex-col justify-center items-center md:w-44 w-full rounded-md hover:text-slate-300 text-gray-400 '>
        <PlusCircle className='size-12 cursor-pointer' />
        <span className='text-sm'>Add a document</span>
    </Link>
  )
}

export default UploadFile