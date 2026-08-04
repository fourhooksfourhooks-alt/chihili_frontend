import Image from 'next/image'
import React from 'react'

export const Poster = () => {
  return (
    <div className='h-screen bg-secondary flex items-center justify-center px-12 py-4'>
      <Image
        src="/poster.jpg"
        alt="Poster Image"
        width={1920}
        height={1080}
        className="w-full h-full object-cover bg-gray-300"
        priority
        />
    </div>
  )
}

export default Poster