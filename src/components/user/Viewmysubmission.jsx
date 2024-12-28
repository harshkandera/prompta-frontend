import toast, { Toaster } from "react-hot-toast";
import "../../pages/signin.css";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../../service/apiconnector";
import React, { useState, useRef, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import img18 from "../../assets/img18.png";
import img15 from "../../assets/img15.png";
import img11 from "../../assets/img11.png";
import img28 from "../../assets/img28.png";
import img29 from "../../assets/img29.png";
import PeerSubmission from "./PeerSubmission";
import ExpertSubmission from "./ExpertSubmission";
import Footer from "../HomePage/Footer";
import { useNavigate } from "react-router-dom";
import { setAssignmentData } from "../../slices/profileSlice";
import { RxCross2 } from "react-icons/rx";
import { useParams, Link, useLocation } from "react-router-dom";
import { BiHome } from "react-icons/bi";

function Viewmysubmission() {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [file, setFiles] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [formDataToSend, setFormDataToSend] = useState(new FormData());
  const [submissionData, setsubmissionData] = useState();
  const [selfsubmitted, setSelfsubmitted] = useState(false);
  const [assignmentid, setAssignmentId] = useState();
  const [assignment, setAssignment] = useState();

  let { UserId, AssignmentId, name } = useParams();

  const location = useLocation();

  useEffect(() => {
    setAssignmentId(AssignmentId);
  }, []);

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
        setAssignment(response.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, [AssignmentId]);

  const formData = {
    assignmentName: name,
  };

  const isDatePassed = (date) => {
    const duedate = new Date(date);
    const currentdate = new Date();
    if (duedate < currentdate) {
      return true;
    } else {
      return false;
    }
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const goToAssignment = (task, index) => {
    dispatch(setAssignmentData(task));

    location.pathname.includes("/adminpannel/view_submission/")
      ? navigate(
          `/adminpannel/my_submission/${UserId}/${task._id}/${task.assignmentTopic}`
        )
      : navigate(
          `/students/my_submission/${UserId}/${task._id}/${task.assignmentTopic}`
        );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
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

        setsubmissionData(response.data.submission);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  return (
    <div>
      {" "}
      <div className="min-h-screen bg-[#F5F7FA] ">
        <div className="bg-richblue-600 h-full text-richblue-10 p-10">
          <div className="flex text-2xl gap-10 font-semibold items-center max-w-4xl">
            <div
              className="hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20"
              onClick={goBack}
            >
              <BiArrowBack />
            </div>

            <div>
              {name} - <span className="text-lg">View Submission</span>
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
            <div className=" max-w-4xl mx-auto font-roboto mt-4 p-6 pt-2 bg-richblue-10 shadow-lg rounded-md">
              {submissionData?.initialDone === true && (
                <div>
                  <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                    <h1 className="text-xl font-bold">Pre Test</h1>
                    <div>
                      <img src={img18} alt="" className="w-8  " />
                    </div>
                  </div>
                  {submissionData?.preTest.map((file, index) => {
                    return (
                      <div>
                        <div
                          key={index}
                          className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                        >
                          <Link to={file.fileurl} target="_blank">
                            {" "}
                            <div className="text-richblue-900 font-semibold hover:underline">
                              <p>
                                {index + 1}. {file.filename}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}

                  <div></div>
                </div>
              )}

              <div>
                <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                  <h1 className="text-xl font-bold">Learning Stage</h1>
                  <div>
                    <img src={img18} alt="" className="w-8  " />
                  </div>
                </div>

                {assignment?.alltasks?.map(
                  (task, index) =>
                    task.visibility && (
                      <div
                        key={index}
                        className={`text-richlue-900 bg-richblue-10 m-2 mb-4 p-2 rounded-md flex justify-between items-center shadow-lg cursor-pointer border-l-8 ${
                          isDatePassed(task.lastDate)
                            ? "border-[#695FDC]"
                            : "border-[#187309]"
                        }  hover:shadow-xl hover:scale-[1.005]`}
                        onClick={() => {
                          goToAssignment(task, index);
                        }}
                      >
                        <div className="flex flex-col justify-evenly items-center">
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="bg-[#F6F5FA] min-w-16 flex rounded-md justify-center items-center h-20">
                              <img
                                src={img11}
                                alt=""
                                className="h-16 w-16 rounded-full"
                              />
                            </div>
                            <div className="flex flex-col justify-center items-center gap-2">
                              <p className=" text-sm font-roboto "> Topic</p>
                              <div className="text-richblue-900 font-semibold text-md ml-4 tracking-wide">
                                {task.assignmentTopic.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center items-center mt-0 mb-4 hidden sm:flex">
                          <p className="text-sm font-roboto "> Due Date</p>
                          <div className="text-xs  text-richblue-900   flex justify-center items-center mt-[12px] ">
                            <p>{formatDate(task.lastDate)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center items-center mt-0 mb-4 hidden sm:flex">
                          <p className=" text-sm font-roboto ">
                            Assignment Type
                          </p>
                          <div className="text-xs  text-richblue-900   flex justify-center items-center mt-[12px] ">
                            <p>{task.assignmentType}</p>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>


            </div>
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Viewmysubmission;
