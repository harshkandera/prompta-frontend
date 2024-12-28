import React from 'react'

const Footer = () => {
    return (
        <div className='w-screen bg-richblue-600  h-30 sm:h-20 rounded-t-lg flex items-center  bottom-0 justify-center'>


            <div className='flex flex-col sm:flex-row gap-6 items-center justify-center'>
                <div className='flex gap-2 font-semibold text-richblue-10 opacity-90 justify-center items-center'>
                    <p>Terms of Use</p>
                    <p>-</p>
                    <p>Privacy Policy</p>
                    <p>-</p>
                    <p>Conditions of Use</p>
                </div>

                <div className='flex gap-4 font-semibold text-richblue-10  justify-center items-center'>
                    <p>Need help ?</p>
                    <p className='h-12 w-32 flex justify-center items-center rounded-lg hover:bg-opacity-50 bg-richblue-10 cursor-pointer bg-opacity-40'>Contact Us</p>
                </div>
            </div>

        </div>)
}

export default Footer;