import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import classes from './Accordion.module.css';

function Accordion({head, body}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={classes['accordion-item']}>
      <div className={classes['accordion-head']} onClick={() => setIsActive(!isActive)}>
        <div>{head}</div>
        <div className={`ml-auto ${classes['chevron']}`}>{isActive ? <FaChevronUp />:<FaChevronDown />}</div>
      </div>
      {isActive && <div className={classes['accordion-body']}>
        {body}
      </div>}
    </div>
  )
}

export default Accordion