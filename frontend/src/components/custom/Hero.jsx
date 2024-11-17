import React from 'react'
import { Button } from '../Button'
import { Link } from 'react-router-dom'
function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1
      className='font-extrabold text-[50px] text-center mt-16' >
        
      <span className='text-[#f56551]'>Discover Your Next Adventure</span> Personalized Car Management at Your Fingertips</h1>
        <p className='text-xl text-gray-500 text-center '>Your ultimate solution for tracking, maintaining, and optimizing vehicle performance, tailored to your needs and budget.</p>   
    <Link to={'/create-product'}>
    <Button>Get Started,It's Free</Button>
    </Link>
    </div>
  )
}

export default Hero