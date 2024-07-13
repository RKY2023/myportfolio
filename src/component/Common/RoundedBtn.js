import React from "react";

function RoundedBtn ( props ) {
  return (
    <button className="text-[#8796a1] text-xl p-2 rounded-full hover:bg-[#3c45c1]" onClick={props.onClick}>
      {props.icon}
    </button>
  );
}
export default RoundedBtn;