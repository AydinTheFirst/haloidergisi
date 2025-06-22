import React from "react";

interface FlipCardProps {
  backContent: React.ReactNode;
  frontImage: string;
}

export default function FlipCard({ backContent, frontImage }: FlipCardProps) {
  return (
    <div>
      <div className='transform-style preserve-3d group relative h-full w-full cursor-pointer overflow-hidden rounded-lg transition-transform duration-700 hover:rotate-y-180'>
        {/* Ön yüz */}
        <div className='absolute h-full w-full backface-hidden'>
          <img
            alt='front'
            className='h-full w-full rounded-lg object-cover'
            src={frontImage}
          />
        </div>

        {/* Arka yüz */}
        <div className='absolute flex h-full w-full rotate-y-180 items-center justify-center rounded-lg bg-gray-900 p-2 text-center text-white backface-hidden'>
          {backContent}
        </div>
      </div>
    </div>
  );
}
