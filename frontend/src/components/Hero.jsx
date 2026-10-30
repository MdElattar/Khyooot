import React from 'react'

const Hero = () => {
  return (
    <div className=' hero flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        
        <div className='text-[#414141]'>
          
          <div className='flex items-center gap-2 '>
            <div className='w-8 md:w-11 h-[2px]  bg-[#414141]'/>
            <p className='font-medium text-sm text md:text-base'>OUR BESTSELLERS</p>
          </div>
          
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>KHYOOT</h1>
          
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-sm  md:text-base'>SHOP NOW</p>
            {/* The line below is incomplete in the image, so I'll close it as an empty tag */}
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]' ></p>
          </div>
          
        </div>
        
      </div>
    {/* The Hero Right Side  */}
    <img src="src/assets/frontend_assets/hoddies.jpeg" className='w-full sm:w-1/2'  alt="" />
    </div>
  )
}

export default Hero // (Assuming you export the component later) 