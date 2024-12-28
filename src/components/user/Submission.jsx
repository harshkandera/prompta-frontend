import toast, { Toaster } from "react-hot-toast";
import "../../pages/signin.css";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../../service/apiconnector";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import img18 from "../../assets/img18.png";
import img15 from "../../assets/img15.png";
import img11 from "../../assets/img11.png";
import img28 from "../../assets/img28.png";
import img29 from "../../assets/img29.png";
import img14 from "../../assets/img14.png";
import img32 from "../../assets/img32.png";
import animationData from "../../assets/lotties/course.lottie";
import Foot from "../HomePage/Footer";
import { BiHome } from "react-icons/bi";
import { setAssignmentData } from "../../slices/profileSlice";
import { RxCross2 } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import { Button, buttonVariants } from "../../component/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
import { CheckCircle2 } from "lucide-react";

import { Step, Stepper, useStepper } from "../../component/ui/stepper";

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
];

const Submission = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [taskInitiate, setTaskInitiate] = useState();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [submissionData, setsubmissionData] = useState();
  const [assignment, setAssignment] = useState();
  const [expand1, setExpand1] = useState({});
  const [initiate, setInitiate] = useState({});
  let { UserId, AssignmentId, name, params } = useParams();

  const [orientation, setOrientation] = React.useState("horizontal");

  const { assignmentData } = useSelector((state) => state.profile);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(Date.parse(dateString))) {
      return "Invalid Date";
    }

    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  useEffect(() => {
    const allids = assignment?.alltasks.map((task) => task._id);

    const initialExpandState = {};

    allids?.forEach((id, index) => {
      const course = submissionData?.courses?.find(
        (course) => course?.assessment?.assignmentId === id
      );

      if (course) {
        initialExpandState[index] = {
          id: course.assessment.assignmentId,
          self: course.assessment.userQuestions[0]?.submitted || false,
          peer: course.assessment.peerQuestions[0]?.submitted || false,
          expert: course.assessment.expertQuestions[0]?.submitted || false,
        };
      } else {
        initialExpandState[index] = {
          id: id,
          self: false,
          peer: false,
          expert: false,
        };
      }
    });

    setInitiate(initialExpandState);

    console.log("initiate", initiate);
  }, [submissionData, assignment]);

  useEffect(() => {
    console.log("initiate", initiate);
  }, [initiate]);

  const checkInitiateSteps = (value) => {
    let setIndex = 0;

    if (value?.self) {
      setIndex = 1;
    }
    if (value?.peer) {
      setIndex = 2;
    }
    if (value?.expert) {
      setIndex = 3;
    }

    return setIndex;
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + `/api/assignment/${AssignmentId}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        console.log(response);
        setAssignment(response.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, [AssignmentId]);

  const isDatePassed = (date) => {
    const duedate = new Date(date);
    const currentdate = new Date();
    if (duedate < currentdate) {
      return true;
    } else {
      return false;
    }
  };

  const findInitiate = (task) => {
    console.log("task", task);
    let foundObject = null;

    for (const key in initiate) {
      if (initiate.hasOwnProperty(key) && initiate[key].id === task._id) {
        foundObject = initiate[key];
        break;
      }
    }

    if (foundObject) {
      setTaskInitiate(foundObject);
    }
  };

  useEffect(() => {
    console.log("taskinitiate", taskInitiate);
  }, [taskInitiate]);
  // Drop down files

  const goToAssignment = (task, index, params) => {
    if (taskInitiate && !taskInitiate.self && params === "peer") {
      return toast.error("Complete the Self Assessment");
    }

    if (
      taskInitiate &&
      (!taskInitiate.self || !taskInitiate.peer) &&
      params === "expert"
    ) {
      return toast.error("Complete the Self And Peer Assessment");
    }

    if (new Date(task.lastDate) < new Date()) {
      toast.error("Date of submission Passed");
    } else if (new Date(task.startDate) > new Date()) {
      toast.error(`submission will Start on ${formatDate(task.startDate)}`);
    } else if (
      assignment?.profMandatory &&
      submissionData &&
      !submissionData?.initialDone &&
      !submissionData?.preTest?.length > 0
    ) {
      toast.error("Please Complete Proficiency Test");
    } else {
      dispatch(setAssignmentData(task));
      navigate(
        `/students/new_submission/${AssignmentId}/${task._id}/${params}`
      );
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL +
            `/api/get_submission/${UserId}/${AssignmentId}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log(response);

        setsubmissionData(response.data.submission);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    if (assignment?.alltasks) {
      const initialExpandState = assignment.alltasks.reduce((acc, _, index) => {
        return { ...acc, [index]: false };
      }, {});
      setExpand1(initialExpandState);
    }

    console.log(expand1);
  }, [assignment]);

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div>
      <div className="min-h-screen ">
        <div className="bg-richblue-600 h-full text-richblue-10 p-10">
          <div className="flex text-2xl gap-10 font-semibold items-center max-w-4xl">
            <div
              className="hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20 cursor-pointer"
              onClick={goBack}
            >
              <BiArrowBack />
            </div>
            <div>
              <span className="font-normal">Add Submission </span>-
              {assignment?.assignmentName}{" "}
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

        {loading ? (
          <div className="flex justify-center items-center h-[100vh] sm:signinbg">
            <div class="spinner"></div>
          </div>
        ) : (
          <div>
            <div className=" max-w-4xl mx-auto mt-4 p-6 pt-2 bg-richblue-10 shadow-lg rounded-md">
              <div>
                <div className=" mt-10 mb-6 ml-2 flex items-center gap-2 text-xl">
                  <h1 className="text-xl font-semibold ">Course Details</h1>
                  <div>
                    <img src={img32} alt="" className="w-8  " />
                  </div>
                </div>
                <div className="flex flex-col gap-4 justify-center items-start p-4 rounded-md bg-gray-50 shadow-md">
                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm text-gray-800  font-bold min-w-fit">
                      Course Name
                    </p>
                    <p className="font-medium">{assignment?.assignmentName}</p>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm  text-gray-800   font-bold min-w-fit">
                      Description
                    </p>
                    <p>{assignment?.description}</p>
                  </div>

                  <div className="flex gap-4 justify-center items-center   mb-4 ">
                    <p className=" text-sm  font-bold min-w-fit"> Schedule</p>

                    <div className="text-sm  text-gray-700 font-semibold   flex justify-center items-center ">
                      <p>
                        {formatDate(assignment?.startDate)} -{" "}
                        {formatDate(assignment?.dueDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm  text-gray-800   font-bold min-w-fit">
                      Instructor Name
                    </p>

                    <p className="font-medium">
                      {assignment?.instructorName} -{" "}
                      <span className="text-xs">
                        {assignment?.instructorDetails}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm  text-gray-800   font-bold min-w-fit">
                      Assessment Type
                    </p>
                    <p>{assignment?.assessmentType}</p>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm  text-gray-800   font-bold min-w-fit">
                      Experts
                    </p>
                    <p>{assignment?.experts}</p>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm  text-gray-800   font-bold min-w-fit">
                      Pre Test Topic
                    </p>
                    <p>{assignment?.preTestTopic}</p>
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <p className="text-sm  text-gray-800   font-bold min-w-fit">
                      Post Test Topic
                    </p>
                    <p>{assignment?.PostTestTopic}</p>
                  </div>

                  <div className="w-full">
                    <h3 className="text-sm font-bold text-gray-800 ">
                      Course Files
                    </h3>
                    {assignment &&
                      assignment?.assignmentfileUrl?.map((file, index) => {
                        return (
                          <div>
                            <div
                              key={index}
                              className="text-richlue-900 max-w-[98%] bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-md cursor-pointer border-l-8 border-[#695FDC]"
                            >
                              <Link
                                to={file.fileurl}
                                target="_blank"
                                className="max-w-[95%]"
                              >
                                <div
                                  className="font-semibold text-sm hover:underline"
                                  target="blank"
                                >
                                  <p>
                                    {index + 1}. {file.filename}
                                  </p>
                                </div>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="w-full">
                    <h3 className="text-sm font-bold text-gray-800 ">
                      Reference Links
                    </h3>
                    {assignment &&
                      assignment?.attachlinks?.map((links, index) => {
                        return (
                          <div
                            key={index}
                            className="text-richlue-900 max-w-[98%] bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-md cursor-pointer border-l-8 border-[#695FDC]"
                          >
                            <Link
                              to={links.linkurl}
                              target="_blank"
                              className="max-w-[95%]"
                            >
                              <p className="hover:underline text-richblue-300  text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                {links.linkurl}
                              </p>
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div>
                <div className="mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                  <h1 className="text-xl font-semibold">Proficiency Test</h1>
                  <div>
                    <img src={img14} alt="" className="w-8" />
                  </div>
                </div>
                <div className="flex justify-center items-center rounded-md shadow-md p-2">
                  <Link
                    to={`/students/proficiency_test/${UserId}/${AssignmentId}`}
                  >
                    <Button className={cn("m-2")}>
                      Attempt the Proficiency Test
                    </Button>
                  </Link>
                </div>
              </div>

              {/* submissionData && submissionData.initialDone && submissionData.preTest.length > 0 */}

              {
                <div>
                  <div className="mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                    <h1 className="text-xl font-semibold">Tasks</h1>
                    <div>
                      <img src={img18} alt="" className="w-8" />
                    </div>
                  </div>

                  {initiate &&
                    assignment?.alltasks?.map(
                      (task, index) =>
                        task.visibility && (
                          <div
                            key={index}
                            className={`text-richlue-900 bg-richblue-10 m-2 mb-4 rounded-md shadow-lg cursor-pointer border-l-8 ${
                              isDatePassed(task.lastDate)
                                ? "border-[#695FDC]"
                                : "border-[#187309]"
                            } p-4 hover:shadow-xl hover:scale-[1.005]`}
                            onClick={() => {
                              findInitiate(task);
                              setExpand1((prevExpand1) => ({
                                ...prevExpand1,
                                [index]: !prevExpand1[index], // Toggle the expand state
                              }));
                            }}
                          >
                            <div className="flex justify-between w-full items-center">
                              <div className="flex flex-col md:max-w-[50%] max-w-full justify-evenly items-center">
                                <div className="flex-1 flex items-center justify-center gap-4 mb-4">
                                  {/* <div className='bg-[#F6F5FA] min-w-16 flex rounded-md justify-center items-center h-20'>
                                <img src={img11} alt="" className='w-16 h-16 rounded-full' />
                              </div> */}

                                  <div className="flex flex-col justify-center items-center">
                                    <p className="text-sm font-semibold">
                                      Task Name
                                    </p>
                                    <div className="text-richblue-900 text-sm ml-4 tracking-wide">
                                      {capitalizeWords(task?.assignmentTopic)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 flex-col justify-center items-center mt-0 hidden sm:flex">
                                <p className="text-sm font-semibold">
                                  Schedule
                                </p>
                                <div className="text-richblue-900 text-xs flex justify-center items-center">
                                  <p>
                                    {formatDate(task?.startDate)} -{" "}
                                    {formatDate(task?.lastDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-1 flex-col justify-center mr-4 items-center mt-0 hidden sm:flex">
                                <p className="text-sm font-semibold">
                                  Task Type
                                </p>
                                <div className="text-richblue-900 text-sm flex justify-center items-center">
                                  <p>{task?.assignmentType}</p>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                expand1[index] ? "max-h-[200vh]" : "max-h-0"
                              }`}
                            >
                              <div className="flex flex-col justify-center ml-4">
                                <div className="flex items-center justify-center mt-2 mb-4">
                                  <div className="border-b-[2px] w-[90%] "></div>
                                </div>

                                <div>
                                  <  TaskQuestionsList  task={task?.assignmentQues} />
                                </div>

                                {/* Your stepper component goes here */}
                                <div className="flex w-full flex-col gap-4">
                                  <Stepper
                                    orientation={orientation}
                                    styles={"data-[current=true]"}

                                    // onClickStep={(step, setStep) =>{
                                    //   toast.success(step)
                                    //   setStep(step)
                                    // }}

                                    setStep={() =>
                                      parseInt(
                                        checkInitiateSteps(initiate[index])
                                      )
                                    }
                                    initialStep={
                                      initiate &&
                                      parseInt(
                                        checkInitiateSteps(initiate[index])
                                      )
                                    }
                                    steps={steps}
                                  >
                                    {steps.map((stepProps, stepIndex) => {
                                      return (
                                        <Step
                                          key={stepProps.label}
                                          {...stepProps}
                                        >
                                          <div
                                            className="h-20 flex items-center shadow-md justify-center my-4 border  text-primary rounded-md"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              goToAssignment(
                                                task,
                                                stepIndex,
                                                stepProps.params
                                              );
                                            }}
                                          >
                                            <h1 className="text-xl">
                                              <Button>{stepProps.label}</Button>
                                            </h1>
                                          </div>
                                        </Step>
                                      );
                                    })}
                                    <Footer
                                      initial={
                                        initiate[index]?.id
                                          ? checkInitiateSteps(initiate[index])
                                          : 0
                                      }
                                    />
                                  </Stepper>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                </div>
              }

              {submissionData && submissionData?.commonfeedback && (
                <div>
                  <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-lg">
                    <h1 className="text-xl font-bold">Expert Feedback</h1>
                    <div>
                      <img src={img29} alt="" className="w-10 " />
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
              )}

              {/* 

              { submissionData && submissionData?.completed &&
                <div className='flex flex-col gap-2 justify-center text-3xl text-gray-700 items-center my-20 font-bold '>
                  <dotlottie-player
                    autoplay
                    playMode="normal"
                    src={animationData}
                    background="transparent"
                    speed="0.5"
                    style={{ width: '100px', height: '100px' }}
                  />
                  <p className='text-center'>Course Completed Successfully !</p>


                </div>

              } 
              
          */}
            </div>
          </div>
        )}
      </div>
      <Foot />
    </div>
  );
};

export default Submission;

const Footer = ({ initial }) => {
  const { nextStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
    useStepper();

  const handleButtonClick = (e) => {
    e.stopPropagation();
    nextStep();
  };

  console.log("Footer rendered"); // Add a console log to check how many times the component renders

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

export const TaskQuestionsList = ({ task }) => {
  return (
    <div className="space-y-4 my-4">
      {task.map((ques, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="text-base">Task {index + 1}</span>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {ques}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};