import React from 'react'

export default function NavBarPortfolio() {
  return (
    <div className='flex justify-center items-center p-2'>
      <div className='text-[#aaa] hover:text-[#fff] cursor-pointer p-2'>
        Projects
      </div>  
      <div className='text-[#aaa] hover:text-[#fff] cursor-pointer'>
        Blogs
      </div>
    </div>
  )
}
