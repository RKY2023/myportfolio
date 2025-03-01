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
          <button onClick={() => { /* handle click */ }}>
            {/* icon */}
            {/* <RoundedBtn icon={<TbCircleDashed />} /> */}
            <RoundedBtn icon={<HiUserCircle />} />
          </button>      
        </li>
      </ul>
      
    </section>
    </div>
  )
}

export default MainFooter