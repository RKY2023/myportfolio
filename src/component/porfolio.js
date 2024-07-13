import React from 'react';
import { cibGithub, cibLinkedinIn, cibTwitter, cibLeetcode } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

function Porfolio() {
  return (
    <div className='flex flex-col justify-content items-center'>
      <div>Hey, I'm Raj. I'm looking for a SDE role for modern web development profile. Which company likely to work on new technology like React, tailwind, NextJS etc.</div>
      <div className='flex flex-wrap justify-evenly items-center my-8' style={{width: '-webkit-fill-available'}}>
        {/* Image */}
        <div className='flex m-5'>
          <img className='rounded-full min-w-[256px] w-[256px] h-[256px]' src='photomin.png' alt='' />
        </div>        
        {/* Social media  infos */}
        <div className='flex flex-col justify-between h-[250px]'>
          <div className='flex'>
            {/* icon */}
            <CIcon icon={cibGithub} className='w-[50px]'/>
            {/* text */}
            <a href={'https://github.com/RKY2023'} className='flex items-center ml-5 text-lg'>
              RKY2023
            </a>
          </div>
          <div className='flex'>
            {/* icon */}
            <CIcon icon={cibLinkedinIn} className='w-[50px]'/>
            {/* text */}
            <a href={'https://www.linkedin.com/in/rajkumaryadav2023'} className='flex items-center ml-5 text-lg'>
              rajkumaryadav2023
            </a>
          </div>
          <div className='flex'>
            <CIcon icon={cibTwitter} className='w-[50px]'/>
            <a href={'https://x.com/rajkumaryd2023'} className='flex items-center ml-5 text-lg'>
              rajkumaryd2023
            </a>
          </div>
          <div className='flex'>
            {/* icon */}
            <CIcon icon={cibLeetcode} className='w-[50px]'/>
            {/* text */}
            <a href={'https://leetcode.com/u/rajkumar2023/'} className='flex items-center ml-5 text-lg'>
              rajkumar2023
              {/* https://leetcode.com/u/rajkumar2023/ */}
            </a>
          </div>
        </div>
        
        
      </div>
      <div className='text-3xl font-bold underline'>
        {/* Summary  */}
        {/* Add Domain KNowledge */}
      </div>
    </div>
  )
}

export default Porfolio