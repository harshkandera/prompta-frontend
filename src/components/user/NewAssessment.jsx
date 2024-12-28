import React from 'react'
import Navbar from "./Navbar"
import { useEffect, useState } from "react"
import { apiConnector } from '../../service/apiconnector'

import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi"
import img11 from "../../assets/img11.png"
import img13 from "../../assets/img13.png"
import Footer from "../HomePage/Footer"
import img14 from "../../assets/img14.png"
import Img24 from "../../assets/img24.png"
import { BiHome } from 'react-icons/bi'
const NewAssessment = () => {
  const [allassignment, setAllassignment] = useState([])
  const { profile } = useSelector((state) => state.profileData)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_user_courses/${user._id}`, null, {
          Authorization: `Bearer ${token}`,
        });

        console.log(response.data);
        setAllassignment(response.data.user.courses)
      } catch (error) {
        console.log(error);
      }
    }

    fetchdata();
  }, []);





  function capitalizeWords(str) {
    if (typeof str !== 'string') {
      return ''; // or any other default value you prefer
    }
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }


  

  const isDatePassed = (startDate, endDate) => {
    if (startDate && endDate) {
      const currentDate = new Date();
      const startdate = new Date(startDate);
      const enddate = new Date(endDate);

      if (currentDate < startdate) {
        return { status: 'Upcoming', color: 'bg-red-500', borderColor: 'border-red-500' };
      } else if (currentDate >= startdate && currentDate <= enddate) {
        return { status: 'Ongoing', color: 'bg-green-500', borderColor: 'border-green-500' };
      } else if (currentDate > enddate) {
        return { status: 'Completed', color: 'bg-[#695FDC]', borderColor: 'border-[#695FDC]' };
      }
    }

    // Return default values for other cases
    return { status: 'Unknown', color: 'bg-gray-500', borderColor: 'border-gray-500' };
  };



  useEffect(() => {
    console.log(allassignment)
  }, [allassignment]);


  const formatDate = (dateString) => {
    // Check if dateString is a valid date string
    if (!dateString || isNaN(Date.parse(dateString))) {
      return 'Invalid Date';
    }

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };


  return (

    <div>
      <div className='min-h-screen mb-10 '>

        <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
          
          <div className='flex text-2xl gap-10 font-semibold items-center max-w-4xl'>
            <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20 cursor-pointer' onClick={goBack}>
              <BiArrowBack />
            </div>


            <div>
              <span className='font-normal'>My Courses</span>          </div>
              <Link
              to={
                user?.accountType === "Admin"
                  ? "/admin/dashboard"
                  : "/students/dashboard"
              }
            >
              <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-richblue-10/20 cursor-pointer">
                <BiHome className="h-6 w-6" />
              </div>
            </Link>
          </div>

       

        </div>

        {loading ? (<div className='flex justify-center items-center h-[100vh] sm:signinbg'>
          <div class="spinner"></div>
        </div>) : (<div className=' max-w-[90%] sm:max-w-4xl mx-auto'>
          <div className='flex items-center gap-2 text-xl'>

            <h1 className=' text-xl font-semibold mt-8 mb-8'>Courses</h1>
            <div>
              <img src={img13} alt="" className='w-16 h-16 rounded-full' />          </div>

          </div>
          <div >

        
            {   allassignment && allassignment?.length > 0 ? 

              (  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            

                { allassignment.slice(0).reverse().map((allassignment, index) => {

                const { status, color, borderColor } = isDatePassed(allassignment?.assessment?.startDate, allassignment?.assessment?.dueDate);

                return (


                  <Link to={`/students/add_submission/${user._id}/${allassignment.assessment?._id}`}>

                    <div key={index} className={`text-richlue-900 bg-richblue-10 min-h-[200px] m-2 p-2 rounded-md grid  grid-cols-4 shadow-lg cursor-pointer min-w-[30%] flex-wrap border-b-8 ${borderColor}  hover:shadow-xl hover:scale-[1.005] hover:bg-gray-100`}>





                      <div className='bg-[#F6F5FA] flex col-start-1 w-14 h-14 rounded-md justify-center items-center'>
                        <img src={img11} alt="" className='w-14 h-14 rounded-full' />
                      </div>


                      <div className='col-start-2 col-span-3 justify-start'>



                        <div className='col-start-2 flex justify-end items-center mb-4 '>


                          <div className={`text-xs flex justify-center text-richblue-10 items-center w-[80px] h-[20px] ${color} rounded-md `}><p>{status}</p></div>

                        </div>


                        <div className='flex gap-2 justify-start  mb-4'>


                          <p className=' text-sm  font-bold min-w-fit' > Course Name</p>


                          <div className='text-sm text-gray-700   flex justify-center items-center '><p>{capitalizeWords(allassignment.assessment.assignmentName)}</p></div>


                        </div>








                        <div className='flex gap-2 justify-start   mb-4 '>

                          <p className=' text-sm  font-bold min-w-fit' > Schedule</p>



                          <div className='text-xs   text-gray-700   flex justify-center items-center '><p>{formatDate(allassignment.assessment.startDate)} - {formatDate(allassignment.assessment.dueDate)}</p></div>

                        </div>





                        <div className='flex gap-2 justify-start   mb-4 '>

                          <p className=' text-sm  font-bold min-w-fit' >Assessment Type</p>


                          <div className='text-xs   text-gray-700   flex justify-center items-center '><p>{allassignment.assessment.assessmentType ? allassignment.assessment.assessmentType : 'Not-Available'}</p></div>

                        </div>

                        <div className='flex gap-2 justify-start   mb-4 '>

                          <p className=' text-sm  font-bold min-w-fit' >Description</p>


                          <div className='text-xs   text-gray-700   flex justify-center items-center '><p>{allassignment.assessment.description ? allassignment.assessment.description : 'Not-Available'}</p></div>

                        </div>


                        <div className='flex gap-2 justify-start   mb-4 '>

                          <p className=' text-sm  font-bold min-w-fit' >Experts</p>


                          <div className='text-xs   text-gray-700   flex justify-center items-center '><p>{allassignment.assessment.experts ? allassignment.assessment.experts : 'Not-Available'}</p></div>

                        </div>

                        <div className='flex justify-end items-center gap-2 '>

                          <p className=' text-xs  font-bold min-w-fit' >Instructor</p>
                          <div className='text-xs   text-gray-700   flex justify-center items-center '><p>{allassignment.assessment.instructorName ? allassignment.assessment.instructorName : 'Not-Available'}</p></div>

                        </div>

                      </div>









                    </div>

                  </Link>)



              } 
              
             )}
             </div>  ) : (
              <div className='mt-20'>
                <div className='mt-20'>
                  <main class="grid min-h-full ">
                    <div className="text-center flex flex-col justify-center items-center">
                      <p className="text-base font-semibold text-indigo-600 w-[180px]"><img src={Img24} alt="" /></p>
                      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-500 sm:text-4xl">No Authorized Course</h1>
                      <div className="mt-10 flex items-center justify-center gap-x-6">
                      </div>
                    </div>
                  </main>
                </div>
              </div>



            )}
          </div>
        </div>)}
      </div>
      <Footer></Footer>
    </div>
  )
}
export default NewAssessment;



