import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'

function CustomLoading({ loading }: { loading: boolean }) {
    return (
        <>
            <AlertDialog open={loading}>
                <AlertDialogContent className='bg-white'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Loading</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className='bg-white flex flex-col items-center my-5 justify-center'>
                        <Image src={'/loading.gif'} height={150} width={150} alt='loading...'/>
                        <h2>
                            Generating your video... Do not refresh
                        </h2>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CustomLoading
