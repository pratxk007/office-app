import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function SelectDuration({onUserSelect}:{
    onUserSelect: (topic:string, value: string) => void
}) {

    return (
        <>
            <div className='mt-7'>
                <h2 className='font-bold text-primary text-xl'>Duration</h2>
                <p className='text-gray-500'>Select the Duration of your video</p>
                <Select onValueChange={(value) => {
                    value != 'Custom Prompt' && onUserSelect('duration', value)
                }}>
                    <SelectTrigger className="w-full p-6 mt-2 text-lg">
                        <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='30 seconds'>30 Seconds</SelectItem>
                        <SelectItem value='60 seconds'>60 Seconds</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}

export default SelectDuration