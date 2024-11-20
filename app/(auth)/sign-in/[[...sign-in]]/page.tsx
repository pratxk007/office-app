import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <>
    <div className=' grid grid-cols-1 md:grid-cols-2 '>
        <div className='flex justify-center items-center shadow-lg'>
            <Image src={'/home.jpg'} alt='home_img' className='' height={500} width={800} />
        </div>
        <div className='flex justify-center items-center h-screen'>
            <SignIn />
        </div>
    </div>
    </>
  )
}