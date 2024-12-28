import React from 'react'
import Img9 from "../assets/img9.png"
import Btn from "../components/HomePage/btn"
import { apiConnector } from '../service/apiconnector'
// import { authentication } from '../service/api'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { setLoading } from '../slices/authenticationSlice'
import { setProfileData } from "../slices/profileSetupSlice"
import "./signin.css"
const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile } = useSelector((state) => state.profileData);


  const [formData, setFormData] = useState({ firstname: "" || profile.firstname, lastname: "" || profile.lastname, instituteName: "" || profile.instituteName, profession: "" || profile.profession} );
  const { firstname, lastname, instituteName, profession} = formData;
  const { user } = useSelector((state) => state.profile)
  const { loading } = useSelector((state) => state.loading)
  const { token } = useSelector((state) => state.auth)
  const headers = {
    'Authorization': `Bearer ${token}`,
  }
  function changehandler(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,


      }
    })
  }


  const Submithandler = async (event) => {
    event.preventDefault();
    formData.email = user.email;
    formData.image = `https://api.dicebear.com/5.x/initials/svg?seed=${formData.firstname}${formData.lastname}`
    // console.log(formData)

    // console.log(headers)
    try {
      dispatch(setLoading(true));

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + "/api/profileupdate", formData, headers);

      // console.log(result)

      if (!result.data.success) {
        toast.error("Failed to Sign up");
        // console.log(result.data.message);
        throw new Error(result.data.message);
      }

      dispatch(setProfileData(formData));

      toast.success("Profile Updated Successfully")
      dispatch(setLoading(false));

      if (user.accountType === "Admin") {
        navigate('/adminpannel/dashboard')
      } else {
        navigate('/students/dashboard')
      }
      
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.response?.data?.message || "Failed to Submit");
      dispatch(setLoading(false));

      // Handle the error, e.g., toast.error("An error occurred");
    }




  }





  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center h-[100vh] sm:signinbg'>
          <div class="spinner"></div>

        </div>
      ) : (
        <div className='max-w-8/12 Signup-bg mb-0 font-almarai signinbg'>
          <div>

            <div className='p-4 mt-10'>

            </div>

            <div className='flex flex-col jusitfy-center items-center m-0'>
              <div className=' text-richblue-900 font-normal text-start'><h1 className='text-4xl font-semibold'> Update Your<span className='text-richblue-300 font-bold'> Profile</span></h1></div>



              <div className='flex flex-wrap-reverse w-8/12 justify-center items-center mx-auto '>


                <div className='m-10 text-richblue-900 ' >
                  
                  <div className='w-16 h-16 rounded-full mb-6'><img src={`https://api.dicebear.com/5.x/initials/svg?seed=${formData.firstname}${formData.lastname}`} alt="" className='w-16 h-16 rounded-full' /></div>
                  <form onSubmit={Submithandler} className='flex flex-col font-inter gap-2 text-gray-900 text-sm font-[400]'>
                      <label className='font-semibold' htmlFor="nameInput">Firstname</label>
                      <input type="fname" className='border-[1px] rounded-md p-2 w-72 focus:outline-0 ' placeholder='firstname' name="firstname" value={firstname} onChange={changehandler} />
                      <label className='font-bold' htmlFor="nameInput">Lastname</label>
                      <input type="lname" className='border-[1px] rounded-md p-2 w-72 focus:outline-0 ' placeholder='lastname' name="lastname" value={lastname} onChange={changehandler} />

                      <label className='font-bold' htmlFor="nameInput">Institute Name</label>
                      <input type="lname" className='border-[1px] rounded-md p-2 w-72 focus:outline-0 ' placeholder='institute name' name="instituteName" value={instituteName} onChange={changehandler} />
                      <label className='font-bold' htmlFor="nameInput">Profession</label>
                      <input type="lname" className='border-[1px] rounded-md p-2 w-72 focus:outline-0 ' placeholder='profession' name="profession" value={profession} onChange={changehandler} />

                    <div className='flex items-center justify-center mt-8'>
                      <Btn>Next</Btn>

                    </div>

                  </form>

                </div>


                <div className='w-80 mt-10'>
                  <img src={Img9} alt="" />
                </div>

              </div>

            </div>




          </div>







          <div className='flex gap-2 justify-center mt-10'>
            <p>Terms of Use</p>
            <p>|</p>
            <p>Privacy Policy</p>
          </div>


        </div>
      )}

    </>
  )

}

export default Signup;