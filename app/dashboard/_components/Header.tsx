import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function Header() {
    return (
        <div className='p-3 px-5 flex items-center justify-between shadow-md '>
            <div className='flex gap-3 items-center'>
                <div className='bg-black p-4 rounded-full h-10 w-10'>
                    <Image src={'/vercel.svg'}  height={12} width={12} alt='logo' />
                </div>
                <h2 className='font-bold text-lg'>Ai Shorts </h2>
            </div>
            <div className='flex items-center gap-4'>
                <Button>Dashboard</Button>
                <UserButton/>
            </div>
        </div>
    )
}

export default Header