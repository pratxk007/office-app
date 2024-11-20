'use client'

import { CircleUser, FileVideo, icons, PanelsTopLeft, ShieldPlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideNav() {

    const MenuOption = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/dashboard',
            icon: PanelsTopLeft
        },
        {
            id: 2,
            name: 'Create New',
            path: '/dashboard/create-new',
            icon: FileVideo
        },
        {
            id: 3,
            name: 'Upgrade',
            path: '/upgrade',
            icon: ShieldPlusIcon
        },
        {
            id: 4,
            name: 'Account',
            path: '/account',
            icon: CircleUser
        },

    ]

    const path = usePathname();
    return (
        <div className='w-64 h-screen shadow-md p-5'>
            <div className='grid gap-2'>
                {MenuOption.map((ele) => (
                    <Link href={ele.path} key={ele.id}>
                        <div className={`flex items-center gap-3 p-3 hover:bg-primary hover:text-white duration-200 rounded-md cursor-pointer ${path==ele.path &&'bg-primary text-white'}`}>
                            <ele.icon />
                            <h2>{ele.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SideNav