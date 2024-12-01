import React from 'react'
import classes from './experience.module.css'

function Experiences() {
  return (
    <div className={classes['experience']}>
      <h1 className='text-xl text-black-walnut'>Experiences</h1>
      <img className={classes['logo']} src={'https://img.10times.com/images/bootlogo_1.png?imgeng=/w_90/h_30/m_stretch/cmpr_60'}/>
      <div>
        Software Developer I 
        <br></br>
        12 Aug 2019 - 25 May 2022
      </div>
    </div>
  )
}

export default Experiences