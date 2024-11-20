'use client'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

function SelectTopic({onUserSelect}: {
    onUserSelect: (topic: string, value: string) => void
}) {
    const options = ['Custom Prompt', "Random AI Stories", 'Scary Story', 'HistoricaL Facts', 'Bed Time Story', 'Motivational', 'Fun Facts'];
    const [selectedOption, setSelectedOption] = useState(options[1]); // Set initial state to a non-custom prompt option

    return (
        <>
            <div>
                <h2 className='font-bold text-primary text-xl'>Content</h2>
                <p className='text-gray-500'>What's the topic of your video?</p>
                <Select onValueChange={(value) => {
                    setSelectedOption(value)
                    value !== 'Custom Prompt' && onUserSelect('topic', value)
                }}>
                    <SelectTrigger className="w-full p-6 mt-2 text-lg">
                        <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            options.map((ele, idx) => (
                                <SelectItem key={idx} value={ele}>{ele}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>

                {
                    selectedOption === 'Custom Prompt' && 
                        <Textarea className='mt-3' onChange={(e) => onUserSelect('topic', e.target.value)} placeholder='Write prompt on which you want to generate the video.' />
                    
                }
            </div>
        </>
    )
}

export default SelectTopic;