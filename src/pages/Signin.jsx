import React from 'react'
import { Link ,useLocation} from "react-router-dom"
import Img5 from "../assets/img5.png"
import Btn from "../components/HomePage/btn"
import { apiConnector } from '../service/apiconnector'
import toast, { Toaster } from 'react-hot-toast';
// import { authentication } from '../service/api'
import {useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {setEmail} from "../slices/otpSlice"
import { useDispatch} from 'react-redux'

import "./signin.css"
const Sendotp= () => { 
const dispatch = useDispatch()
const [loading,setloading]=useState(false)
  const navigate = useNavigate()
  const [formData,setFormData] = useState({email:""})
  const {email} = formData
  let logo = "PROMPTa";

  function changehandler(event) {
    setFormData(prevFormData =>{
      return {
        ...prevFormData,
        [event.target.name] : event.target.value,
      }
    })
  }
  
 const location = useLocation();



const SubmitHandler = async (e) => {
  e.preventDefault();
  if (formData.email === "") {
    toast.error("Please enter your email");
  } else {
    setloading(true);
    try {
      dispatch(setEmail(formData.email));
      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + '/api/sendotp', formData);
      // console.log(result);

      if (result.data && !result.data.success) {
        if (result.data.message === "User with this email already exists.") {
          // Display a message to the user indicating that the email is already registered.
          toast.error("User with this email already exists.");
        } else {
          // Handle other error cases
          toast.error("Failed to Sign In");
          console.log(result.data.message);
        }
        throw new Error(result.data.message);
      }

      // If registration was successful, navigate to the signup page
      setloading(false)
      toast.success("OTP sent successfully");
      navigate("/signup");
    } catch (error) {
      console.log(error)
      setloading(false)
      toast.error(error.response?.data?.message || "Failed to Submit");

    } 
  }
};


const SubmitHandler1 = async (e) => {
  e.preventDefault();
  if (formData.email === "") {
    toast.error("Please enter your email");
  } else {
    setloading(true);
    try {
      dispatch(setEmail(formData.email));
      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + '/api/forgot_password', formData);
      // console.log(result);

      if (result.data && !result.data.success) {
        toast.error("Failed To Change Password");

      }

      // If registration was successful, navigate to the signup page
      setloading(false)
      toast.success("OTP sent successfully");
      navigate("/change_password");
    } catch (error) {
      console.log(error)
      setloading(false)
      toast.error(error.response?.data?.message || "Failed to Login");

    } 
  }
};





  return (
<>

{
loading ? (
  <div className='flex justify-center items-center h-[100vh] sm:signinbg'>
    <div class="spinner"></div>

  </div>
) :(
<div className='max-w-8/12 Signup-bg mb-0 font-almarai signinbg '>

  
<div>

  <div className='p-4'>
    <ul className='flex justify-end gap-2 pr-4 text-richblue-900 font-[400] text-lg'>
      <li>Already a member?</li>
      <li className='text-richblue-300'><Link to="/login">Log in</Link></li>
    </ul>
  </div>

  <div className='flex flex-col jusitfy-center items-center m-0'>

  <div className='mb-2 text-richblue-900 font-normal text-start'>
    <h1 className='text-4xl font-semibold'>
      {location.pathname === '/forgot_password'
        ? 'Change your'
        : 'Create your'}
      <br />
      <span className='text-richblue-300 font-bold'>{logo}</span>
      {location.pathname === '/forgot_password'
        ? ' Password'
        : ' Account'}
    </h1>
  </div>




    <div className='flex flex-wrap-reverse w-8/12 justify-center items-center mx-auto '>


      <div className='m-20 text-richblue-900'>

      <form onSubmit={location.pathname === '/forgot_password' ? SubmitHandler1 : SubmitHandler} className='flex flex-col text-lg font-[400]'>
  <label htmlFor="emailInput">Enter Your Email</label>
  <input type="email" className='border-[1px] rounded-md p-2 w-72 focus:outline-0' placeholder='Email' name="email" value={email} onChange={changehandler} />
  <div className='flex items-center justify-center mt-8'>
    <Btn>Next</Btn>
  </div>
</form>


      </div>


      <div className='w-80 mt-10'>
        <img src={Img5} alt="" />
      </div>

    </div>

  </div>




</div>







<div className='flex gap-4 justify-center  sm:mt-28'>
  <p>Terms of Use</p>
  <p>|</p>
  <p>Privacy Policy</p>
</div>


</div>

)


}

    
</>


  )
}

export default Sendotp;