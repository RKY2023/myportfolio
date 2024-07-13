import React from 'react'
import RoundedBtn from '../Common/RoundedBtn'
import { HiUserCircle } from '../UI/Icons/CustomIcons'

function MainFooter() {
  return (
    <div>
      Footer
    <section>
      <ul>
        <li>
          <a href="">
            {/* icon */}
            {/* <RoundedBtn icon={<TbCircleDashed />} /> */}
            <RoundedBtn icon={<HiUserCircle />} />
          </a>      
        </li>
      </ul>
      
    </section>
    </div>
  )
}

export default MainFooter