import React from 'react'
import { Button } from './button'
import { UserButton, SignedIn } from '@clerk/nextjs'
import { FilePlus2 } from 'lucide-react'
import Link from 'next/link'

function Header() {
  return (
    <div className='px-2 py-3 flex border-b border-gray-200 justify-between items-center'>
        <div className='text-xl'>Chat to <span className='text-blue-600'>PDF</span></div>

        <div className='flex items-center gap-4 md:gap-8 '>
            <Button className="hidden md:block cursor-pointer" variant={"link"}> Pricing </Button>
            <Link href={"/dashboard"}>
            <Button className={"hidden md:block cursor-pointer"} variant={"outline"}>My Documents</Button>
            </Link>
            <Link href={"/upload"}>
            <FilePlus2 className='text-blue-600 cursor-pointer'/>
            </Link>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
  )
}

export default Header