import React from 'react';
import { cibGithub, cibTwitter, cibLeetcode } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

function Porfolio() {
  return (
    <div className='flex flex-col justify-content items-center'>
      <div>Hey, I'm Raj. I'm looking for a SDE role for modern web development profile. Which company likely to work on new technology like React, tailwind, NextJS etc.</div>
      <div className='flex justify-evenly items-center my-8' style={{width: '-webkit-fill-available'}}>
        {/* Image */}
        <div className='m-5'>
        <img className='rounded-full w-[256px] h-[256px]' src='https://pbs.twimg.com/profile_images/1797955529551089664/OLixcd1Y_200x200.jpg' alt='' />
        </div>
        
        {/* Social media  infos */}
        <div className='flex flex-col justify-between items-center h-[250px]'>
          <div className='flex'>
            {/* icon */}
            <CIcon icon={cibGithub} className='w-[50px]'/>
            {/* text */}
            <a href={'https://github.com/RKY2023'} className='flex items-center ml-2 text-lg'>
              RKY2023
            </a>
          </div>
          <div className='flex'>
            {/* icon */}
            <CIcon icon={cibTwitter} className='w-[50px]'/>
            {/* text */}
            <a href={'https://x.com/RajKuma49762038'} className='flex items-center ml-2 text-lg'>
              @RajKuma49762038
            </a>
          </div>
          <div className='flex'>
            {/* icon */}
            <CIcon icon={cibLeetcode} className='w-[50px]'/>
            {/* text */}
            <a href={'https://leetcode.com/u/rajkumar2023/'} className='flex items-center ml-2 text-lg'>
              rajkumar2023
              {/* https://leetcode.com/u/rajkumar2023/ */}
            </a>
          </div>
        </div>
        
        
      </div>
      <div className='text-3xl font-bold underline'>
        Summary 
        {/* Add Domain KNowledge */}
      </div>
    </div>
  )
}

export default Porfolio