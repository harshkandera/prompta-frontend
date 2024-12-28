import React from 'react'
 const btn = ({children,linkto}) => {
  return (

<button className='  flex justify-center items-center  w-[280px] bg-richblue-300 rounded-sm h-[30px] text-richblue-10 font-[400] transition-all duration-200 hover:scale-95' type="submit">{children}</button>
   )
}

export default btn;