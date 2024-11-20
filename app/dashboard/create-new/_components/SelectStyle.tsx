import Image from 'next/image';
import React, { useState } from 'react';

interface StyleOption {
    name: string;
    image: string;
}

function SelectStyle({onUserSelect}:{
    onUserSelect: (topic: string, value:string) => void
    }) {
    const styleOption: StyleOption[] = [
        {
            name: 'Real',
            image: '/real.jpg',
        },
        {
            name: 'Cartoon',
            image: '/cartoon.avif',
        },
        {
            name: 'Comic',
            image: '/comic.jpg',
        },
        {
            name: 'Watercolor',
            image: '/watercolor.jpg',
        },
        {
            name: 'GTA',
            image: '/gta.png',
        },
    ];

    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

    return (
        <>
            <div className="mt-7">
                <h2 className="font-bold text-primary text-xl">Style</h2>
                <p className="text-gray-500">Select your video style?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {styleOption.map((ele, idx) => (
                        <div
                            key={idx}
                            className={`relative hover:scale-105 transition-all rounded-xl cursor-pointer ${selectedOption === ele.name &&'border-4 border-primary'}`}
                            onClick={() => {setSelectedOption(ele.name)
                                onUserSelect('imageStyle', ele.name )
                            }}
                        >
                            <Image
                                src={ele.image}
                                height={100}
                                width={100}
                                alt="story_styles"
                                className="h-48 object-cover mt-3 rounded-lg w-full"
                            />
                            <h2 className="bg-black absolute p-1 bottom-0 w-full text-white text-center rounded-b-lg">
                                {ele.name}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SelectStyle;
