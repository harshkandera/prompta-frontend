import toast from "react-hot-toast";
import "../../pages/signin.css";
import { useSelector } from "react-redux";
import { apiConnector } from "../../service/apiconnector";
import React, { useState, useRef, useEffect } from "react";

import img18 from "../../assets/img18.png";
import img15 from "../../assets/img15.png";

import img28 from "../../assets/img28.png";

import Footer from "../HomePage/Footer";
import img25 from "../../assets/img25.png";

import { RxCross2 } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../component/ui/button";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";

function ProficiencyTest() {
  const [submissionData, setsubmissionData] = useState();
  const [assignment, setAssignment] = useState();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const [file, setFiles] = useState([]);
  const navigate = useNavigate();
  let { UserId, AssignmentId } = useParams();
  const [formDataToSend, setFormDataToSend] = useState(new FormData());

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const formData = {
    assignmentName: assignment?.assignmentName,
  };

  const handleFileChange = (event) => {
    const newFiles = [...file, event.target.files];
    setFiles(newFiles);
  };
  function deletehandle(index) {
    const updated = file.filter((file, i) => i !== index);
    setFiles(updated);
  }
  const handleDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (files.length > 0) {
      setFiles([...file, files]);
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
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

  // pre task submit handler
  const submithandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      file &&
        file.forEach((f) => {
          formDataToSend.append("file", f[0]);
        });

      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL +
          `/api/new_assessment/${UserId}/${AssignmentId}`,
        formDataToSend,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      if (!result.data.success) {
        toast.error("failed to submit");
        setFiles([]);
        setLoading(false);
        throw new Error(result.data.message);
      }

      setFiles([]);
      setFormDataToSend(new FormData());

      if (result.data.success) {
        setsubmissionData(result.data.updatedAssignment);
      }

      setLoading(false);
      toast.success("Pre Test Submitted Successfully");
    } catch (error) {
      setFiles([]);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  // post task submit handler

  const finaltaskhandler = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      file &&
        file.forEach((f) => {
          formDataToSend.append("file", f[0]);
        });

      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL +
          `/api/final_task/${UserId}/${AssignmentId}`,
        formDataToSend,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );
      if (!result.data.success) {
        toast.error("failed to submit");
        setLoading(false);
        setFiles([]);
        throw new Error(result.data.message);
      }
      setFiles([]);
      setLoading(false);
      setFormDataToSend(new FormData());

      toast.success("Post file Submitted Successfully");

      const updatedSubmissionResult = await apiConnector(
        "GET",
        process.env.REACT_APP_BASE_URL +
          `/api/get_submission/${UserId}/${AssignmentId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (updatedSubmissionResult.data.success) {
        setsubmissionData(updatedSubmissionResult.data.submission);
      }
    } catch (error) {
      setFiles([]);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

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
              <span className="font-normal">Proficiency Test</span>-{" "}
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
          <>
            <div className=" max-w-4xl mx-auto mt-4 p-6 pt-2 bg-richblue-10 shadow-lg rounded-md">
              {/* PRE TASK */}

              {submissionData &&
                !submissionData.initialDone &&
                !(submissionData?.preresponses.length > 0) && (
                  <>
                    <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                      <h1 className="text-xl font-semibold ">Diagnostic Test</h1>
                      <div>
                        <img src={img18} alt="" className="w-8  " />
                      </div>
                    </div>

                    {/* New section to display pretest topic */}
                    {assignment?.preTestTopic && (
                      <div className="my-4 ml-2 text-base ">
                        <span className="font-medium text-">
                          Diagnostic Test Topic :
                        </span>
                        <span className="text-sm">
                          {assignment?.preTestTopic}
                        </span>
                      </div>
                    )}

                    <div>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                        ref={inputRef}
                        multiple
                        hidden
                        onChange={handleFileChange}
                      />

                      <div
                        className="col-span-full"
                        onClick={() => inputRef.current.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                      >
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[#4477CE]  px-6 py-10  bg-richblue-100">
                          <div className="text-center flex flex-col justify-center items-center">
                            <div>
                              <img
                                src={img15}
                                alt=""
                                className="w-16 h-16 rounded-full"
                              />
                            </div>
                            <div className="mt-4 flex text-sm leading-6 ">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 ">
                              PNG, JPG,up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {file.map((file, index) => {
                        return (
                          <div>
                            <div
                              key={index}
                              className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                            >
                              <div className="text-richblue-900 font-semibold text-xs ">
                                <p>
                                  {index + 1}. {file[0].name}
                                </p>
                              </div>

                              <div
                                className="mr-4 text-lg cursor-pointer"
                                onClick={() => deletehandle(index)}
                              >
                                <RxCross2 />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {file.length > 0 && (
                        <div className="flex mt-4 justify-center items-center">
                          <Button variant="btn" onClick={submithandler}>
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}

              {submissionData?.initialDone && (
                <div>
                  <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                    <h1 className="text-xl font-semibold ">Diagnostic Test</h1>
                    <div>
                      <img src={img18} alt="" className="w-8  " />
                    </div>
                  </div>

                  {/* New section to display pretest topic */}
                  {assignment?.preTestTopic && (
                    <div className="my-4 ml-2 text-base ">
                      <span className="font-medium text-">
                        Diagnostic Test Topic :
                      </span>
                      <span className="text-sm">
                        {assignment?.preTestTopic}
                      </span>
                    </div>
                  )}

                  {assignment?.profMarksVisible &&
                    submissionData?.initialDone &&
                    submissionData?.preTest?.length > 0 &&
                    submissionData?.preresponses &&
                    submissionData?.preresponses?.length > 0 &&
                    submissionData?.preTotalMarks &&
                    submissionData?.preMarks && (
                      <div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md my-10 w-[150px] rounded-md">
                        <div className="flex flex-col justify-center items-center">
                          <img src={img25} alt="" className="w-8" />
                          <p className="text-md font-semibold">Score</p>
                        </div>
                        <div>
                          <span className=" font-semibold ">
                            {submissionData?.preTotalMarks}
                          </span>
                          <span className="font-semibold text-sm opacity-80">
                            / {submissionData?.preMarks}
                          </span>
                        </div>
                      </div>
                    )}

                  {submissionData?.preTest?.length > 0 &&
                    submissionData?.preTest?.map((file, index) => {
                      return (
                        <div>
                          <div
                            key={index}
                            className="text-richlue-900 text-xs bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                          >
                            <Link to={file.fileurl} target="_blank">
                              {" "}
                              <div className="text-richblue-900  font-semibold text-xshover:underline">
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

              {/* POST TASK */}

              {submissionData &&
                submissionData?.initialDone &&
                assignment?.postTaskVisible &&
                !submissionData?.postTest.length > 0 && (
                  <>
                    <div className="mt-20">
                      <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                        <h1 className="text-xl font-semibold ">Evaluative Test</h1>
                        <div>
                          <img src={img28} alt="" className="w-10  " />
                        </div>
                      </div>

                      {/* New section to display pretest topic */}
                      {assignment?.postTestTopic && (
                        <div className="my-4 ml-2 text-base ">
                          <span className="font-medium text-">
                            Evaluative Test Topic :
                          </span>
                          <span className="text-sm">
                            {assignment?.postTestTopic}
                          </span>
                        </div>
                      )}

                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                        ref={inputRef}
                        multiple
                        hidden
                        onChange={handleFileChange}
                      />

                      <div
                        className="col-span-full"
                        onClick={() => inputRef.current.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                      >
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[#4477CE]  px-6 py-10  bg-richblue-100">
                          <div className="text-center flex flex-col justify-center items-center">
                            <div>
                              <img
                                src={img15}
                                alt=""
                                className="w-16 w-16 rounded-full"
                              />
                            </div>
                            <div className="mt-4 flex text-sm leading-6 ">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 ">
                              PNG, JPG,up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {file.map((file, index) => {
                        return (
                          <div>
                            <div
                              key={index}
                              className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                            >
                              <div className="text-richblue-900 font-semibold text-xs">
                                <p>
                                  {index + 1}. {file[0].name}
                                </p>
                              </div>

                              <div
                                className="mr-4 text-lg cursor-pointer"
                                onClick={() => deletehandle(index)}
                              >
                                <RxCross2 />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {file && file.length > 0 && (
                        <div className="flex mt-4 justify-center items-center">
                          <Button variant="btn" onClick={finaltaskhandler}>
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              {submissionData && submissionData?.postTest.length > 0 && (
                <>
                  <div className="mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                    <h1 className="text-xl font-semibold">Evaluative Test</h1>
                    <div>
                      <img src={img28} alt="" className="w-10" />
                    </div>
                  </div>

                  {/* Post Test Topic Display */}
                  {assignment?.postTestTopic && (
                    <div className="my-4 ml-2 text-base">
                      <span className="font-medium mr-2">Evaluative Test Topic:</span>
                      <span className="text-sm text-gray-700">
                        {assignment?.postTestTopic}
                      </span>
                    </div>
                  )}
                </>
              )}

              {assignment?.profMarksVisible &&
                submissionData &&
                submissionData?.postresponses?.length > 0 &&
                submissionData?.postTotalMarks &&
                submissionData?.postMarks && (
                  <div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md my-10 w-[150px] rounded-md">
                    <div className="flex flex-col justify-center items-center">
                      <img src={img25} alt="" className="w-8" />
                      <p className="text-md font-semibold">Score</p>
                    </div>
                    <div>
                      <span className=" font-semibold ">
                        {submissionData?.postTotalMarks}
                      </span>
                      <span className="font-semibold text-sm opacity-80">
                        / {submissionData?.postMarks}
                      </span>
                    </div>
                  </div>
                )}

              {submissionData &&
                submissionData?.postTest.length > 0 &&
                submissionData?.postTest.map((file, index) => {
                  return (
                    <div>
                      <div
                        key={index}
                        className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                      >
                        <Link to={file.fileurl} target="_blank">
                          {" "}
                          <div className="text-richblue-900 font-semibold  text-xs hover:underline">
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
          </>
        )}
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}

export default ProficiencyTest;
