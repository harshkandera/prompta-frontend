import React from 'react'
import {Link} from "react-router-dom"
 const Button = ({children,linkto}) => {
  return (

  <Link to={linkto}>
<div className='  flex justify-center items-center  w-[120px] bg-richblue-200 rounded-md h-[40px] text-richblue-10 font-semibold transition-all duration-200 hover:scale-[1.02]'>{children}</div>
  </Link>
   )
}

export default Button;