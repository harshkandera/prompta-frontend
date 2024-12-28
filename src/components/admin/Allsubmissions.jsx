import React from 'react'
import Navbar from "../user/Navbar"
import footer from "../HomePage/Footer"
import img18 from '../../assets/img18.png';
import { useNavigate } from 'react-router-dom';
import { setAssignmentData } from "../../slices/profileSlice"
import { RxCross2 } from 'react-icons/rx';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { apiConnector } from '../../service/apiconnector'
import img11 from "../../assets/img11.png"
import toast, { Toaster } from 'react-hot-toast';
import { BiArrowBack } from "react-icons/bi"
import img28 from "../../assets/img28.png"
import img29 from "../../assets/img29.png"
import img14 from "../../assets/img14.png"
import animationData from '../../assets/lotties/course.lottie';
import { Button, buttonVariants } from "../../component/ui/button"

import { cn } from '../../lib/utils'


import {
  Step,
  Stepper,
  useStepper
} from "../../component/ui/stepper"



const steps = [
  {
    label: "Self Assessment",
    params: "self",

  },
  {
    label: "Peer Assessment",
    params: "peer",

  },
  {
    label: "Mentor Assessment",
    params: "expert",
  },
]



function Allsubmissions() {

  const { UserId, AssignmentId, name } = useParams();

  const navigate = useNavigate()



  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };


  const dispatch = useDispatch();


  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState();
  const [assignment, setAssignment] = useState()
  const [expand1, setExpand1] = useState({})
  const [initiate, setInitiate] = useState({})
  const [prefinalResponses, setpreFinalResponses] = useState([]);
  const [postfinalResponses, setpostFinalResponses] = useState([]);
  const [marksGot1, setmarksGot1] = useState()
  const [marksGot2, setmarksGot2] = useState()
  const [feedback, setFeedback] = useState('')

  const [question, setQuestion] = useState([])
  const [preQuestion, setPreQuestion] = useState()
  const [postQuestion, setPostQuestion] = useState()
  const [preTestexpand, setPreTestexpand] = useState(false)
  const [postTestexpand, setPostTestexpand] = useState(false)
  const [preTotal, setPreTotal] = useState(0)
  const [postTotal, setPostTotal] = useState(0)


  const [orientation, setOrientation] =
    React.useState("horizontal")

  const { assignmentData } = useSelector((state) => state.profile)



  useEffect(() => {
    if (Array.isArray(question) && question.length > 0) {

      const preQues = question.filter((ques) => ques.assignmentType === 'preTest')

      setPreQuestion(preQues)

      const userresponses = preQues[0]?.diagnosticQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setpreFinalResponses(userresponses);
    }
  }, [question]);

  useEffect(() => {
    if (Array.isArray(question) && question.length > 0) {

      const postQues = question.filter((ques) => ques.assignmentType === 'postTest')
      setPostQuestion(postQues)

      const userresponses = postQues[0]?.diagnosticQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setpostFinalResponses(userresponses);
    }
  }, [question]);



  useEffect(() => {
    let totalMarks;
    if (preQuestion && preQuestion[0]?.diagnosticQues && preQuestion[0]?.diagnosticQues?.length > 0) {
      totalMarks = preQuestion[0]?.diagnosticQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      setPreTotal(totalMarks)
    }

  }, [preQuestion])

  useEffect(() => {
    let totalMarks;
    if (postQuestion && postQuestion[0]?.diagnosticQues && postQuestion[0]?.diagnosticQues?.length > 0) {
      totalMarks = postQuestion[0]?.diagnosticQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      setPostTotal(totalMarks);
    }
  }, [postQuestion]);



  
  // For preQuestion
  useEffect(() => {
    let totalMarks;
    if (prefinalResponses && prefinalResponses.length > 0) {
      totalMarks = prefinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      setmarksGot1(totalMarks);
    }
  }, [prefinalResponses]);



  // For postQuestion
  useEffect(() => {
    let totalMarks;
    if (postfinalResponses && postfinalResponses.length > 0) {
      totalMarks = postfinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      setmarksGot2(totalMarks);
    }
  }, [postfinalResponses]);





  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_diagnostics`, null, {
          Authorization: `Bearer ${token}`,
        });
        console.log(response)
        setQuestion(response.data.alltype);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);


  useEffect(() => {
    console.log(question)
  }, [question])

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setSubmissionData(response.data.submission);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);



  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/assignment/${AssignmentId}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setAssignment(response.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, [AssignmentId]);




  useEffect(() => {
    if (submissionData?.courses) {
      const initialExpandState = {};
      submissionData.courses?.forEach((course, index) => {
        initialExpandState[index] = {
          id: course?.assessment?._id || null,
          self: course?.assessment?.userQuestions[0]?.submitted || false,
          peer: course?.assessment?.peerQuestions[0]?.submitted || false,
          expert: course?.assessment?.expertQuestions[0]?.submitted || false
        };
      });
      setInitiate(initialExpandState);
    }

    // console.log(initiate);

  }, [submissionData]);



  const checkInitiateSteps = (value) => {

    let setIndex = 0;

    if (value?.self) {
      setIndex = 1
    }
    if (value?.peer) {
      setIndex = 2
    }
    if (value?.expert) {
      setIndex = 3
    }

    return setIndex

  }







  const isDatePassed = (date) => {
    const duedate = new Date(date)
    const currentdate = new Date();
    if (duedate < currentdate) {
      return true;
    } else {
      return false;
    }
  }

  

  const goToAssignment = (task, index, params) => {

    dispatch(setAssignmentData(task));
    navigate(`/adminpannel/user_submission/${UserId}/${task._id}/${params}`);

  }




  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };













  useEffect(() => {
    if (assignment?.alltasks) {

      const initialExpandState = assignment.alltasks.reduce((acc, _, index) => {
        return { ...acc, [index]: false };
      }, {});
      setExpand1(initialExpandState);
    }

    console.log(expand1)
  }, [assignment]);




  function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  

  const postAssessmentHandler = async (event) => {
    event.preventDefault();

    try {

      setLoading(true)

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/post_diagnostics/${UserId}/${AssignmentId}`, {
        postfinalResponses,
        marksGot2,
        postTotal
      }, {
        Authorization: `Bearer ${token}`,
      });


      // console.log(result)

      if (!result.data.success) {
        toast.error("failed to submit")
        setLoading(false)
        throw new Error(result.data.message);
      }

      // console.log(result);

      toast.success('Self Assessment Submitted Successfully');



      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        setSubmissionData(response.data.submission);
      }



      setLoading(false)


    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || 'Failed to submit');

    }
  };



  const preAssessmentHandler = async (event) => {
    event.preventDefault();

    try {

      setLoading(true)

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/pre_diagnostics/${UserId}/${AssignmentId}`, {
        prefinalResponses,
        marksGot1,
        preTotal

      }, {
        Authorization: `Bearer ${token}`,
      });


      // console.log(result)

      if (!result.data.success) {
        toast.error("failed to submit")
        setLoading(false)
        throw new Error(result.data.message);
      }

      console.log(result);

      toast.success('Self Assessment Submitted Successfully');



      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        setSubmissionData(response.data.submission);
      }



      setLoading(false)


    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || 'Failed to submit');

    }
  };




  const expertfeedback = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/expert_feedback/${UserId}/${AssignmentId}`, {
        feedback,
      }, {
        Authorization: `Bearer ${token}`,
      });

      if (!result.data.success) {
        setLoading(false);
        throw new Error(result.data.message);
      }


      setLoading(false);
      toast.success('Send to User Successfully');


      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        setSubmissionData(response.data.submission);
      }


      // console.log(updatedSubmissionResult)

    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Submit");
      console.error('An error occurred:', error);
    }
  };





  return (


    <div>

      < div className='min-h-screen '>
        <div className='bg-richblue-600 h-full  text-richblue-10 p-10'>
          <div className='flex text-2xl gap-10 font-semibold items-center max-w-4xl'>
            <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20 cursor-pointer' onClick={goBack}>
              <BiArrowBack />
            </div>


            <div>
              {name} - <span className='text-lg'>View Submission</span>
            </div>

          </div>

        </div>
        <div>





          {

            loading ? (<div className='flex justify-center items-center h-[100vh] sm:signinbg'>
              <div class="spinner"></div>

            </div>) : (
              <div >
                <div className=' max-w-4xl mx-auto my-8  p-6 pt-2 bg-richblue-10 shadow-lg rounded-md'>


                  


                <div>
                
                <div className='mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                  <h1 className='text-xl font-semibold'>Proficiency Test</h1>
                  <div>
                    <img src={img14} alt="" className='w-8' />
                  </div>
                </div>
                <div className='flex justify-center items-center rounded-md shadow-md p-2'>
                  <Link to={`/adminpannel/proficiency_test/${UserId}/${AssignmentId}`}>

                    <Button className={cn('m-2')}>
                      Go the Proficiency Test
                    </Button>
                  </Link>

                </div>


              </div>
              




                  {submissionData && submissionData.initialDone && submissionData.preTest.length > 0 &&
                    <div>
                      <div className='mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                        <h1 className='text-xl font-semibold'>Tasks</h1>
                        <div>
                          <img src={img18} alt="" className='w-8' />
                        </div>
                      </div>

                      {initiate && assignment?.alltasks?.map((task, index) => (
                        task.visibility && (
                          <div key={index} className={`text-richlue-900 bg-richblue-10 m-2 mb-4 rounded-md shadow-md  cursor-pointer border-l-8 ${isDatePassed(task.lastDate) ? 'border-[#695FDC]' : 'border-[#187309]'} p-4 hover:shadow-lg hover:scale-[1.005]`}
                            onClick={() => {
                              setExpand1((prevExpand1) => ({
                                ...prevExpand1,
                                [index]: !prevExpand1[index] // Toggle the expand state
                              }));
                            }}>

                            <div className='flex justify-between items-center'>
                              <div className='flex flex-col max-w-full md:max-w-[50%] justify-evenly items-center'>
                                <div className='flex items-center justify-center gap-4 mb-4'>
                                  {/* <div className='bg-[#F6F5FA] min-w-16 flex rounded-md justify-center items-center h-20'>
                                    <img src={img11} alt="" className='w-16 h-16 rounded-full' />
                                  </div> */}
                                  <div className='flex flex-col justify-center items-center'>
                                    <p className='text-sm font-semibold'>Task Name</p>
                                    <div className='text-richblue-900 text-sm ml-4 tracking-wide'>
                                      {capitalizeWords(task.assignmentTopic)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='flex flex-col justify-center items-center mt-0 hidden sm:flex'>
                                <p className='text-sm font-semibold'>End Date</p>
                                <div className='text-richblue-900 text-xs flex justify-center items-center'>
                                  <p>{formatDate(task.lastDate)}</p>
                                </div>
                              </div>
                              <div className='flex flex-col justify-center mr-4 items-center mt-0 hidden sm:flex'>
                                <p className='text-sm font-semibold'>Task Type</p>
                                <div className='text-richblue-900 text-sm flex justify-center items-center'>
                                  <p>{task.assignmentType}</p>
                                </div>
                              </div>
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expand1[index] ? 'max-h-[200vh]' : 'max-h-0'}`}>
                              <div className='flex flex-col justify-center ml-4'>

                                <div className='flex items-center justify-center mt-2 mb-4'>
                                  <div className='border-b-[2px] w-[90%] '></div>
                                </div>


                                {/* Your stepper component goes here */}
                                <div className="flex w-full flex-col gap-4">



                                  <Stepper orientation={orientation}
                                    styles={
                                      'data-[current=true]'
                                    }

                                    onClickStep={(step, setStep) => {
                                      toast.success(step)
                                      setStep(step)
                                    }}

                                    setStep={() => parseInt(checkInitiateSteps(initiate[index]))}

                                    initialStep={initiate && parseInt(checkInitiateSteps(initiate[index]))} steps={steps}>
                                    {steps.map((stepProps, stepIndex) => {

                                      return (
                                        <Step key={stepProps.label} {...stepProps} >
                                          <div className="h-20 flex items-center shadow-md justify-center my-4 border  text-primary rounded-md" onClick={(e) => {
                                            e.stopPropagation();
                                            goToAssignment(task, stepIndex, stepProps.params);
                                          }}>
                                            <h1 className="text-xl"><Button>{stepProps.label}</Button></h1>
                                          </div>
                                        </Step>
                                      );
                                    })}
                                    <Footer initial={initiate[index]?.id ? checkInitiateSteps(initiate[index]) : 0} />
                                  </Stepper>
                                </div>

                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  }





                 

                  

                    {submissionData && submissionData?.completed && submissionData?.postTest?.length > 0 && !submissionData?.commonfeedback && (
                     <div className="shadow-md  rounded-lg p-2">
                        <div className='mt-10 mb-2 ml-2 flex items-center gap-2 text-lg'>
                          <h1 className='text-xl font-bold'>Expert Feedback</h1>
                          <div>
                            <img src={img29} alt="" className='w-10' />
                          </div>
                        </div>
                        <div>
                          <textarea
                            type="text"
                            name="expertQuestion"
                            className="block w-full rounded-md border-0 py-1.5 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Add Feedback"
                            rows={2}
                            value={submissionData?.commonfeedback || feedback}
                            onChange={(e) => { setFeedback(e.target.value) }}
                          />
                        </div>
                      </div>
                    )}


                    {submissionData && submissionData?.completed && submissionData?.postTest?.length > 0  && !submissionData?.commonfeedback && feedback &&(

                      <div className='flex mt-10 justify-center items-center'>
                        <Button variant='btn'  onClick={expertfeedback}>
                        Next
                        </Button>
                   
                      </div>
                    )}
                








                  {submissionData && submissionData?.commonfeedback && <div>
                    <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-lg'>
                      <h1 className='text-xl font-bold'>Expert Feedback</h1>
                      <div >
                        <img src={img29} alt="" className='w-10 ' />

                      </div>
                    </div>
                    <div>
                      <textarea
                        type="text"
                        name="expertQuestion"
                        className="block w-full rounded-md border-0 py-1.5  font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                        placeholder="Add Feedback"
                        rows={2}
                        value={submissionData?.commonfeedback}
                      />
                    </div>
                  </div>


                  }

                </div>


              </div >)
          }



        </div>




      </div>
      <footer></footer>
    </div>
  )
}

export default Allsubmissions


























const Footer = ({ initial }) => {
  const {
    nextStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();


  // useEffect(() => {
  //   // Call nextStep() exactly 'initial' times when the component mounts
  //   for (let i = 0; i < initial; i++) {
  //     nextStep();
  //   }
  // }, []); // Empty dependency array ensures the effect runs only once on mount


  const handleButtonClick = (e) => {
    e.stopPropagation();
    nextStep();
  };


  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-20 flex items-center justify-center border text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {!hasCompletedAllSteps && (
          <Button size="sm" onClick={handleButtonClick}>
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        )}
      </div>
    </>
  );
};
