import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBarPortfolio() {
  return (
    <div className='flex justify-center items-center p-2'>
      <div className='text-[#aaa] hover:text-[#fff] cursor-pointer p-2'>
        <Link to='/projects'>Projects</Link>
      </div>  
      {/* <div className='text-[#aaa] hover:text-[#fff] cursor-pointer'>
        <Link to='/blogs'>Blogs</Link>
      </div> */}
    </div>
  )
}
