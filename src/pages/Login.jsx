import React from 'react'
import { Link } from "react-router-dom"
import Img8 from "../assets/img8.png"
import Btn from "../components/HomePage/btn"
import { apiConnector } from '../service/apiconnector'
// import { authentication } from '../service/api'
import {  useState,useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import {BiShowAlt ,BiHide} from "react-icons/bi"
import "./signin.css"
import {useDispatch,useSelector} from "react-redux"
import { signInFailure,signInStart,signInSuccess} from '../slices/profileSlice'
import {setToken} from "../slices/authSlice"
import { fetchprofileData } from '../slices/profileSetupSlice'
import { setIstoken } from '../slices/profileSlice'
const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {error,user}=useSelector((state)=>state.profile)
const [showpassword,setshowpassword]= useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" })
  const { email, password } = formData;
  let logo = "PROMPTA";
const {profile} = useSelector((state)=>state.profileData)
  function changehandler(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
        
       
      }
    })
  }
const [loading, SetLoading]=useState(false)

  const togglehandler =() =>{
    setshowpassword(!showpassword);
  }

  
  const Submithandler = async (event) => {
    event.preventDefault();
// console.log(formData)


try {
  SetLoading(true)
dispatch(signInStart())
  const result = await apiConnector('POST',  process.env.REACT_APP_BASE_URL + '/api/login', formData);

  // console.log(result)
  // console.log(result.data.data.token)

  if (!result.data.success) {
    dispatch(signInFailure(result.response.data.message))
    console.log(error)
    toast.error(error);
    throw new Error(result.data.message);
  } 

  toast.success("logged in successfully")
SetLoading(false);
dispatch(signInSuccess(result.data.data)) 
dispatch(setToken(result.data.data.token))
dispatch(setIstoken(true));
dispatch(fetchprofileData(result.data.data.profile));
navigate("/")
// console.log(profile)
} catch (error) {
  SetLoading(false);
dispatch(signInFailure(error))
console.error("An error occurred:", error);
toast.error(error.response?.data?.message || "Failed to Login");

}




  }

  


  return (
    <>
    { loading ? (
      <div className='flex justify-center items-center h-[100vh] sm:signinbg'>
      <div class="spinner"></div>
  
    </div>
    ):(
      <div className='max-w-8/12 Signup-bg mb-0 font-almarai signinbg '>
      <div>

       

        <div className='flex flex-col jusitfy-center items-center mt-20'>
          <div className=' text-richblue-900 font-normal flex flex-col justify-center items-center'><h1 className='text-2xl font-semibold'>Welcome Back To</h1>
          <h1>
          <span className='text-richblue-300 font-bold text-4xl'>{logo}</span>
          </h1>
          </div>
          <div className='p-2'>
          <ul className='flex justify-end gap-2 pr-4 text-richblue-900 font-[400] text-lg'>
            <li>Don't have any account?</li>
            <li className='text-richblue-300'><Link to="/sendotp">Sign up</Link></li>
          </ul>
        </div>

          <div className='flex flex-wrap-reverse w-8/12 justify-center items-center mx-auto '>


            <div className='m-10 text-richblue-900 ' >

              <form onSubmit={Submithandler} className='flex flex-col text-lg font-[400] relative'>
                <label htmlFor="emailInput">Email</label>
                <input type="email" className='border-[1px] rounded-md p-2 w-72 focus:outline-0 ' placeholder='Email' name="email" value={email} onChange={changehandler} />
              

                <label htmlFor="passwordInput">Enter a password</label>
                <input type={showpassword?  'text':'password'} className='border-[1px] rounded-md p-2 w-72 focus:outline-0' placeholder='Password' name="password" value={password} onChange={changehandler} />
                {
                  showpassword ? <BiHide className='absolute top-[110px] left-[255px]'  onClick={togglehandler}/>:  <BiShowAlt className='absolute top-[110px] left-[255px]' onClick={togglehandler}/> 
                }
                    
                   

                <div className='flex items-center justify-center mt-8'>
                  <Btn>Next</Btn>
                 
                </div>

              </form>

              <div className='p-2'>
          <ul className='flex justify-center gap-2 pr-4 text-richblue-900 font-[400] text-lg'>
          
            <li className='text-richblue-300'><Link to="/forgot_password">Forgot password?</Link></li>
          </ul>
        </div>
            </div>
            <div className='vert-move w-80 mt-10'>
              <img src={Img8} alt="" />
            </div>

          </div>

        </div>




      </div>







      <div className='flex gap-2 justify-center mt-20'>
        <p>Terms of Use</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>


    </div>
    )}
    
    </>
  )

}

export default Login;