import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function EmptyState() {
    return (
        <>
            <div className='p-5 flex items-center flex-col border-2 border-dotted mt-10 py-24'>
                <h2>You haven't created any shorts yet!!</h2>
                <Link href={'/dashboard/create-new'}>
                    <Button>Create New Shorts</Button>
                </Link>
            </div>
        </>
    )
}

export default EmptyState