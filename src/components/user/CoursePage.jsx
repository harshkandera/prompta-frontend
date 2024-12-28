import React from 'react'
import { BiArrowBack } from "react-icons/bi"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from 'react-router-dom';
import { apiConnector } from '../../service/apiconnector'
import { useState, useRef, useEffect } from 'react';
import img31 from '../../assets/img31.png'
import { MdOutlineWatchLater } from "react-icons/md";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { IoBag } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import { MdGroup } from "react-icons/md";
import { IoBagCheck } from "react-icons/io5";
import { BsPatchCheck } from "react-icons/bs";
import Footer from "../HomePage/Footer"
import animationData from '../../assets/lotties/course.lottie';
import '@dotlottie/player-component';
import submissionAnimation from '../../assets/lotties/submission.lottie'
import { BiHome } from 'react-icons/bi';
function CoursePage() {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false);
    const [group, setGroup] = useState()
    const [course, setCourse] = useState({})
    const [checked, setChecked] = useState(false)
    const goBack = () => {
        navigate(-1); // This is equivalent to history.goBack()
    };

    
    let { name, id } = useParams()

    const [assignmentData, setAssignmentData] = useState({})

    function capitalizeWords(str) {
        if (!str) return '';
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }



    useEffect(() => {
        const fetchdata = async () => {
            try {

                const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/assignment/${id}`, null, {
                    Authorization: `Bearer ${token}`,
                });

                console.log(response.data.assignment);

                if (response.data.assignment) {
                    setAssignmentData(response.data.assignment)
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchdata();
    }, []);

    useEffect(() => {
        const fetchdata = async () => {
            try {

                const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_submission/${user._id}/${id}`, null, {
                    Authorization: `Bearer ${token}`,
                });

                console.log(response.data.submission
                );

                if (response.data.submission
                ) {
                    setCourse(response.data.submission
                    )
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchdata();
    }, []);


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };


    function intToAlphabet(num) {
        if (num >= 1 && num <= 26) {
            return String.fromCharCode(num + 64); // 65 corresponds to 'A', 66 to 'B', and so on
        } else {
            return null; // Return null for numbers outside the valid range
        }
    }


    const submithandler = async (event) => {
        event.preventDefault();

        try {

            if (!group) {
                return toast.error('select the group')
            }
            setLoading(true);
            const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/authorize_course/${user._id}/${id}/${group}`, null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            });

            console.log(result);
            setCourse(result.data.newCourseEnrollment)
            setChecked(true)

            toast.success('Course Requested Successfully');
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed To Request");

            console.error('An error occurred:', error);
        }
    };



    return (

        <div className='min-h-screen  font-roboto'>
            {checked &&
                <div className='fixed h-screen w-screen bg-[#352067] bg-opacity-80 flex justify-center items-center z-50' onClick={() => setChecked(false)
                } >
                    <div className='bg-richblue-10 flex flex-col w-60 rounded-lg text-richblue-300 font-semibold justify-center items-center h-72 gap-4 relative z-50'>
                    <div className='absolute'>
                        <dotlottie-player
                            autoplay
                            playMode="normal"
                            src={submissionAnimation}
                            background="transparent"
                            speed="0.5"
                            style={{ width: '100vh', height: '100vh' }}
                        />
                    </div>

                          
                        <dotlottie-player
                            autoplay
                            playMode="normal"
                            src={animationData}
                            background="transparent"
                            speed="0.5"
                            style={{ width: '100px', height: '100px' }}
                        />
                    

                        <div className="flex flex-col justify-center items-center"><h1 className='font-bold '>
                            Good Job!
                        </h1>
                            <p className="text-sm flex font-normal justify-center items-center">Your request has sent</p>
                            <p className='text-sm font-normal '>Successfully.</p>
                        </div>

                        <Link to="/students/dashboard">
                            <div className=" border-[1px] border-richblue-400 rounded-2xl text-ichblue-400 text-sm flex justify-center items-center bg-[#F5E4F8] p-2"><button >
                                BACK TO THE DASHBOARD
                            </button></div>
                        </Link>
                    </div>

                </div>
            }

            <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
                <div className='flex text-2xl gap-10 font-semibold items-center max-w-4xl'>
                    <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20' onClick={goBack}>
                        <BiArrowBack />
                    </div>


                    <div>
                        {name}
                    </div>
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
            <div className='w-10/12 my-8  mx-auto flex flex-col sm:flex-row gap-8'>



                <div className='w-full sm:w-[45%] p-2 border-[1px] rounded-lg h-full'>

                    <div className='w-full'>
                        <img src={img31} alt="" className='w-full rounded-lg' />
                    </div>


                    <div className='mt-2 bg-richblue-300 text-richblue-10 rounded-full h-6 w-60 gap-2 flex justify-center items-center'>

                        <MdOutlineWatchLater /><p className='text-sm'>{formatDate(assignmentData && assignmentData?.startDate)}  <b>-</b>  {formatDate(assignmentData && assignmentData?.dueDate)}</p>
                    </div>

                    <div className='text-gray-900 px-6 pt-6'>
                        <h3 className='text-xl p-2 text-gray-900 font-bold '>{capitalizeWords(assignmentData && assignmentData?.assignmentName)}</h3>


                        <p className='text-sm opacity-90 font-medium'>{assignmentData && assignmentData?.description}</p>

                    </div>
                    <div className='px-6 pt-6'>
                        <p >By -<span className='underline font-bold'>{assignmentData && assignmentData?.instructorName}</span></p>

                        <p className='text-xs opacity-90  font-medium'>{assignmentData && assignmentData?.instructorDetails}</p>
                    </div>
                    <div className='px-6 pt-6'>
                        <h3 className='text-sm '>Course Files</h3>
                        {assignmentData &&
                            assignmentData?.assignmentfileUrl?.map((file, index) => {

                                return <div>

                                    <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
                                        <Link to={file.fileurl} target="_blank"><div className='text-sm hover:underline' target='blank' ><p>{index + 1}. {file.filename}</p></div></Link>


                                    </div>
                                </div>




                            })
                        }

                        <h3 className='text-sm '>Reference Links</h3>
                        {
                            assignmentData && assignmentData?.attachlinks?.map((links, index) => {
                                return <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between  items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
                                    <Link to={links.linkurl} target='_blank' >
                                        <p className='hover:underline text-sm text-richblue-300'>{links.linkurl}</p></Link>


                                </div>



                            })
                        }

                    </div>


                </div>
                <div className='w-full sm:w-[45%] rounded-lg border-[1px] h-full'>
                    <div className='p-4'>

                        <div className='my-2  gap-2 flex  items-center'>
                            <div><MdOutlineCalendarMonth /></div>
                            <div className='flex flex-col justify-center'>
                                <h3 className='text-xs opacity-80'>starting at</h3>
                                <p className='text-sm'>{formatDate(assignmentData && assignmentData?.startDate)}</p>
                            </div>

                        </div>

                        <div className='my-2  gap-2 flex  items-center'>
                            <div><PiChalkboardTeacherBold /></div>
                            <div className='flex flex-col justify-center'>
                                <h3 className='text-xs opacity-80'>Instructor</h3>
                                <p className='text-sm'>{assignmentData && assignmentData?.instructorName}</p>
                            </div>

                        </div>

                        <div className='my-2 gap-2 flex  items-center'>
                            <div  >
                                <MdGroup />
                            </div>
                            <div className='flex flex-col justify-center'>
                                <h3 className='text-xs opacity-80'>Select Group</h3>
                                <select
                                    name="assignmentType"
                                    autoComplete="assignmentName"
                                    value={group || course.group}
                                    onChange={(e) => setGroup(e.target.value)}

                                    className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    <option selected disabled >Groups</option>
                                    {
                                        assignmentData && assignmentData.groups && Array.from({ length: assignmentData.groups }, (_, index) => (
                                            <option key={index} value={index + 1}>{intToAlphabet(index + 1)}</option>
                                        ))
                                    }

                                </select>
                            </div>
                        </div>

                    </div>

                   
                    {(course && course.userId === user._id && course.assignmentId === id && course.verified ) && (new Date(assignmentData.dueDate) > new Date()) && <Link to={`/students/add_submission/${user._id}/${id}`}><div className='w-full h-16 flex text-lg gap-2 cursor-pointer items-center justify-center text-richblue-10  bg-[#695FDC] rounded-b-lg hover:opacity-90' >
                        <div className='text-xl'><BsPatchCheck /></div>
                        <p>Authorized !</p>



                    </div>
                    </Link>
                    }





                    {(course && course.userId === user._id && course.assignmentId === id && !course.verified) && (new Date(assignmentData.dueDate) > new Date()) && <div className='w-full h-16 flex text-lg gap-2 cursor-pointer items-center justify-center text-richblue-10  bg-green-500 rounded-b-lg hover:opacity-90' onClick={() => {
                        toast.success('Request has been sent wait for Authorize')
                    }}>
                        <div className='text-xl'><IoBagCheck /></div>
                        <p>Request Sent</p>



                    </div>

                    }

                    {(Object.keys(course).length === 0) && (new Date(assignmentData.dueDate) > new Date()) &&
                        <div className='w-full h-16 flex text-lg gap-2 cursor-pointer items-center justify-center text-richblue-10  bg-richblue-300 rounded-b-lg hover:opacity-90' onClick={submithandler}>
                            {loading ? <svg className='load' viewBox="25 25 50 50">
                                <circle r="20" cy="50" cx="50"></circle>
                            </svg> : <> <div className='text-xl'><IoBag /></div>
                                <p>Request to Authorize</p>
                            </>

                            }

                        </div>

                    }

                    {(assignmentData && new Date(assignmentData.dueDate) < new Date()) && <div className='w-full h-16 flex text-lg gap-2 cursor-pointer items-center justify-center text-richblue-10  bg-[#695FDC] rounded-b-lg hover:opacity-90' onClick={() => {
                        toast.success('Course Completed')
                    }}>
                        <div className='text-xl'><BsPatchCheck /></div>
                        <p>Completed !</p>



                    </div>

                    }
                </div>

            </div>

            <Footer> </Footer>
        </div>
    )
}

export default CoursePage;