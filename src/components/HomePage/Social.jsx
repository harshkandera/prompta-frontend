import React from 'react'
import {Link} from "react-router-dom"
const Social = ({children,linkto}) => {
  return (
    <div>

<Link to={linkto}>
<div className='rounded-full w-10 h-10 bg-richblue-300 text-richblue-10 flex justify-center items-center text-3xl transition-all duration-200 hover:scale-95'>
{children}
</div>
</Link>

    </div>
  )
}

export default Social;