import React, { useState, useEffect } from 'react';
import Footer from "../HomePage/Footer"
import { BiArrowBack } from "react-icons/bi"
import img23 from "../../assets/img23.png"
import { useParams, Link, useLocation } from 'react-router-dom';
import { apiConnector } from '../../service/apiconnector'
import { useSelector } from 'react-redux'
import img14 from "../../assets/img14.png"
import Img24 from "../../assets/img24.png"
import img22 from "../../assets/img22.png"
import { useNavigate } from 'react-router-dom';
function Reports() {

  const [allassignment, setAllassignment] = useState([])
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const { userId, name } = useParams();

  const { token } = useSelector((state) => state.auth)
  const [submissionData, SetsubmissionData] = useState()


  const location = useLocation();




  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true)
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + '/api/v2/get_assignment', {
          Authorization: `Bearer ${token}`,
        });

        // console.log(response.data.allassignments);
        setAllassignment(response.data.allassignments)
        setLoading(false)

      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    }

    fetchdata();
  }, []);




  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_user_courses/${userId}`, null, {
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



  // useEffect(() => {
  //   console.log(allassignment)
  // }, [allassignment]);


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


      <div className=' h-full min-h-screen'>
        <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
          <div className='flex text-2xl gap-10 font-semibold items-center max-w-4xl'>
            <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20' onClick={goBack}>
              <BiArrowBack />
            </div>


            <div>
              <span className='font-normal'>{name}</span>
            </div>

          </div>

        </div>

        <div className=' m-8 font-roboto  max-w-[90%] sm:max-w-4xl mx-auto text-richblue-900 '>

          {location.pathname.includes('submissions') ?
            <div>
              <div className='w-20 h-20'><img src={img22} alt="" /></div>
              <div className='text-xl font-semibold'>Submission</div>
            </div> :
            <div className=' mt-10 mb-10 ml-2 flex items-center gap-2 text-xl'>
              <h1 className='text-xl font-bold font-inter'>Reports</h1>
              <div >
                <img src={img23} alt="" className='w-12 h-12 ' />

              </div>
            </div>
          }





          {allassignment && allassignment.length > 0 ? (
            allassignment.slice(0).reverse().map((allassignment, index) => {

              const { status, color, borderColor } = isDatePassed(allassignment?.assessment?.startDate, allassignment?.assessment?.dueDate);

              return (

               
                <Link to={location.pathname.includes('submissions') ? `/adminpannel/all_submission/${userId}/${allassignment.assessment?._id}/${name}` : `/adminpannel/user_report/${userId}/${allassignment.assessment?._id}/${name}`}>
                  <div key={index} className={`text-richlue-900 bg-richblue-10 m-2 mb-4 p-2 rounded-md shadow-lg cursor-pointer border-l-8  hover:shadow-xl ${borderColor}
              }`}  >


                    <div className='flex flex-col'>
                      <div className='flex  justify-between   items-center '>
                        <div className='flex flex-col justify-center items-center'>
                          <div className='flex items-center justify-center gap-2 mb-4'>
                            <div className='bg-[#F6F5FA] w-16 flex rounded-md justify-center items-center h-20'>
                              <img src={img14} alt="" className='w-16 ' />
                            </div>
                            <div className='flex flex-col justify-center items-center gap-2'>
                              <p className=' text-sm  font-bold ' > Course Name</p>
                              <div className='text-richblue-900  text-lg ml-4 '>{capitalizeWords(allassignment.assessment?.assignmentName)}</div>

                            </div>

                          </div>

                        </div>

                        <div className='flex flex-col justify-center items-center mt-0 mb-4 hidden sm:flex'>

                          <p className=' text-sm  font-bold' >Schedule</p>
                          <div className='text-xs  text-richblue-900   flex justify-center items-center mt-[12px] '><p>{formatDate(allassignment.assessment?.startDate)} - {formatDate(allassignment.assessment?.dueDate)}</p></div>

                        </div>



                        <div className='flex flex-col justify-center items-center mt-0'>

                          <p className=' text-sm  mt-0 font-bold' >Status</p>
                          <div className={`text-xs flex justify-center m text-richblue-10 items-center w-[80px] h-[20px] ${color} rounded-md font-roboto  mt-[10px] `}><p>{status}</p></div>


                        </div>
                      </div>




                    </div>

                  </div>

                </Link>)



            })
          ) : (
            <div className='mt-20'>
              <main class="grid min-h-full ">
                <div class="text-center flex flex-col justify-center items-center">
                  <p class="text-base font-semibold text-indigo-600 w-[180px]"><img src={Img24} alt="" /></p>
                  <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">No Submission Found</h1>
                  <div class="mt-10 flex items-center justify-center gap-x-6">
                  </div>
                </div>
              </main>
            </div>



          )}




        </div>

      </div>

      <Footer></Footer>
    </div>
  );
}

export default Reports;



