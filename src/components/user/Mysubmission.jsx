import React, { Component } from "react";
import Chart from "react-apexcharts";
import { BiArrowBack } from "react-icons/bi";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiConnector } from "../../service/apiconnector";
import { useSelector } from "react-redux";
import img22 from "../../assets/img22.png";
import Img24 from "../../assets/img24.png";
import img18 from "../../assets/img18.png";
import img15 from "../../assets/img15.png";
import img19 from "../../assets/img19.png";
import img20 from "../../assets/img20.png";
import img21 from "../../assets/img21.png";
import img23 from "../../assets/img23.png";
import img25 from "../../assets/img25.png";
import Footer from "../HomePage/Footer";
import img26 from "../../assets/img26.png";
import img27 from "../../assets/img27.png";
import img28 from "../../assets/img28.png";
import img29 from "../../assets/img29.png";
import { BiHome } from "react-icons/bi";
const Mysubmission = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const [peermarkGot, setPeermarkGot] = useState();
  const [usermarkGot, setUsermarkGot] = useState();
  const [expertmarkGot, setExpertmarkGot] = useState();
  const [loading, setLoading] = useState(false);
  const { UserId, AssignmentId, name } = useParams();
  const [submissionData, setSubmissionData] = useState();

  useEffect(() => {
    if (
      submissionData &&
      submissionData.peerQuestions[0]?.response.length > 0
    ) {
      const markGotSum = submissionData.peerQuestions[0].response.reduce(
        (sum, response) => {
          return (
            sum +
            response.responses.reduce((responseSum, ques) => {
              return responseSum + ques.markGot;
            }, 0)
          );
        },
        0
      );
      setPeermarkGot(markGotSum);
      // console.log(markGotSum)
    }
  }, [submissionData]);

  useEffect(() => {
    if (
      submissionData &&
      submissionData.userQuestions[0]?.response.length > 0
    ) {
      const markGotSum = submissionData.userQuestions[0].response.reduce(
        (sum, response) => {
          return (
            sum +
            response.responses.reduce((responseSum, ques) => {
              return responseSum + ques.markGot;
            }, 0)
          );
        },
        0
      );
      setUsermarkGot(markGotSum);
      // console.log(markGotSum)
    }
  }, [submissionData]);

  useEffect(() => {
    if (
      submissionData &&
      submissionData.expertQuestions[0]?.response.length > 0
    ) {
      const markGotSum = submissionData.expertQuestions[0].response.reduce(
        (sum, response) => {
          return (
            sum +
            response.responses.reduce((responseSum, ques) => {
              return responseSum + ques.markGot;
            }, 0)
          );
        },
        0
      );
      setExpertmarkGot(markGotSum);
      // console.log(markGotSum)
    }
  }, [submissionData]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const Result = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL +
            `/api/get_course/${UserId}/${AssignmentId}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (Result.data.success) {
          setSubmissionData(Result.data.course);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    console.log(submissionData);
  }, [submissionData]);

  return (
    <div>
      <div className="min-h-[100vh] ">
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

        <div className="font-roboto max-w-[90%] sm:max-w-4xl mx-auto text-richblue-900 mt-4">
          <div>
            <div className="w-20 h-20">
              <img src={img22} alt="" />
            </div>
            <div className="text-xl font-semibold">Submission</div>
          </div>

          <div></div>
          {loading ? (
            <div className="flex justify-center items-center h-[100vh] sm:signinbg">
              <div class="spinner"></div>
            </div>
          ) : (
            <div>
              {!submissionData && (
                <div className="mt-20">
                  <main class="grid min-h-full ">
                    <div class="text-center flex flex-col justify-center items-center">
                      <p class="text-base font-semibold text-indigo-600 w-[180px]">
                        <img src={Img24} alt="" />
                      </p>
                      <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                        "Submission not found"
                      </h1>
                      <div class="mt-10 flex items-center justify-center gap-x-6"></div>
                    </div>
                  </main>
                </div>
              )}

              {
                <div>
                  <div className=" max-w-4xl mx-auto font-roboto mt-4 p-6 pt-2 bg-richblue-10 shadow-lg rounded-md">
                    {submissionData && (
                      <div>
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                          <h1 className="text-xl font-bold">Self Assessment</h1>
                          <div>
                            <img src={img19} alt="" className="w-8  " />
                          </div>
                        </div>
                      </div>
                    )}

                    {submissionData &&
                      submissionData.userQuestions[0]?.submitted === true &&
                      submissionData.userQuestions[0]?.response.length > 0 && (
                        <div className="flex text-richblue-900 justify-center items-center gap-4 shadow-md w-[150px] rounded-md">
                          <div className="flex flex-col justify-center items-center">
                            <img src={img25} alt="" className="w-8" />
                            <p className="text-md font-semibold">Score</p>
                          </div>
                          <div>
                            <span className="opacity-90 font-semibold ">
                              {usermarkGot}
                            </span>
                            <span className="font-semibold text-sm opacity-60">
                              / {submissionData.userQuestions[0].totalMark}
                            </span>
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.userQuestions.length > 0 && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 ">
                          <h1 className="text-lg font-bold">
                            Self Assessment Response
                          </h1>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.userQuestions.length > 0 &&
                      submissionData.userQuestions[0].response.map(
                        (response, index) => {
                          return (
                            <div key={index}>
                              {response.responses.length > 0 && (
                                <div className="font-semibold font-roboto underline">
                                  {response.headingType}
                                </div>
                              )}

                              {response.responses.map((ques, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer"
                                  >
                                    <div>
                                      <div className="text-richblue-300 font-semibold min-w-[70%]">
                                        <p>
                                          {idx + 1}. {ques.question}
                                        </p>
                                      </div>
                                      <div>
                                        {response.answer !== null && (
                                          <div className="min-w-[60%] text-sm font-roboto">
                                            <p className="font-roboto text-sm font-semibold ">
                                              Response :
                                            </p>

                                            {response.answer}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="bg-richblue-600 w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center  ">
                                      <p>
                                        {ques.markGot}/{ques.actualMark}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      )}

                    {submissionData &&
                      submissionData.userQuestions.length > 0 &&
                      submissionData.userQuestions[0].submitted === true &&
                      submissionData.peerQuestions?.length > 0 &&
                      submissionData.peerQuestions[0]?.myfile.length > 0 && (
                        <div>
                          <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                            <h1 className="text-xl font-bold">
                              Peer Assessment
                            </h1>
                            <div>
                              <img src={img21} alt="" className="w-10  " />
                            </div>
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.userQuestions.length > 0 &&
                      submissionData.userQuestions[0].submitted === true &&
                      submissionData.peerQuestions?.length > 0 &&
                      submissionData.peerQuestions[0]?.myfile.length > 0 &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.response.length > 0 && (
                        <div className="flex text-richblue-900 justify-center items-center gap-4 shadow-md w-[150px] rounded-md">
                          <div className="flex flex-col justify-center items-center">
                            <img src={img25} alt="" className="w-8" />
                            <p className="text-md font-semibold">Score</p>
                          </div>
                          <div>
                            <span className="opacity-90 font-semibold ">
                              {peermarkGot}
                            </span>
                            <span className="text-sm opacity-60 font-semibold">
                              / {submissionData.peerQuestions[0].totalMark}
                            </span>
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.peerQuestions &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0].myfile &&
                      submissionData.peerQuestions[0].myfile.length > 0 && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                          <h1 className="text-sm font-bold">User File</h1>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.peerQuestions &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0].myfile &&
                      submissionData.peerQuestions[0].myfile.length > 0 &&
                      submissionData.peerQuestions[0].myfile.map(
                        (file, index) => {
                          return (
                            <div key={index}>
                              <div className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]">
                                <Link to={file.fileurl} target="_blank">
                                  <div className="text-richblue-900 font-semibold hover:underline">
                                    <p>
                                      {index + 1}. {file.filename}
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          );
                        }
                      )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0].peerfile.length > 0 && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                          <h1 className="text-sm font-bold">Peer File</h1>
                        </div>
                      )}
                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0].peerfile.length > 0 &&
                      submissionData.peerQuestions[0].peerfile.map(
                        (file, index) => {
                          return (
                            <div>
                              <div
                                key={index}
                                className="text-richlue-900 bg-richblue-10 m-2 mb-8 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
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
                        }
                      )}

                    {submissionData && (
                      <div>
                        <div>
                          {submissionData &&
                            submissionData.peerQuestions.length > 0 &&
                            submissionData.peerQuestions[0].response.length >
                              0 && (
                              <div className=" mt-10 mb-2 ml-2 flex items-center gap-2">
                                <h1 className="text-lg font-bold">
                                  Response Got From Peer
                                </h1>
                              </div>
                            )}

                          {submissionData &&
                            submissionData.peerQuestions.length > 0 &&
                            submissionData.peerQuestions[0].response.length >
                              0 &&
                            submissionData.peerQuestions[0].response.map(
                              (response, index) => {
                                return (
                                  <div key={index}>
                                    {response.responses.length > 0 && (
                                      <div className="font-semibold font-roboto underline">
                                        {response.headingType}
                                      </div>
                                    )}

                                    {response.responses.map((ques, idx) => {
                                      return (
                                        <div
                                          key={idx}
                                          className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer"
                                        >
                                          <div>
                                            <div className="text-richblue-300 font-semibold min-w-[70%]">
                                              <p>
                                                {idx + 1}. {ques.question}
                                              </p>
                                            </div>
                                            <div>
                                              {ques.answer !== null && (
                                                <div className="min-w-[60%] text-sm font-roboto">
                                                  <p className="font-roboto text-sm font-semibold ">
                                                    Response :
                                                  </p>

                                                  {ques.answer}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          {ques.answer === null && (
                                            <div className="bg-richblue-600 w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center ">
                                              <p>
                                                {ques.markGot}/{ques.actualMark}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.peerQuestions[0].response.length > 0 &&
                      submissionData.peerQuestions[0].submitted &&
                      submissionData.expertQuestions[0] && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                          <h1 className="text-xl font-bold">
                            Teacher Assessment
                          </h1>
                          <div>
                            <img src={img23} alt="" className="w-10 " />
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.expertQuestions[0]?.submitted &&
                      submissionData.expertQuestions[0]?.response.length >
                        0 && (
                        <div className="flex text-richblue-900 justify-center items-center gap-4 shadow-md w-[150px] rounded-md">
                          <div className="flex flex-col justify-center items-center">
                            <img src={img25} alt="" className="w-8" />
                            <p className="text-md font-semibold">Score</p>
                          </div>
                          <div>
                            <span className="opacity-90 font-semibold ">
                              {expertmarkGot}
                            </span>
                            <span className="font-semibold text-sm opacity-60">
                              / {submissionData.expertQuestions[0].totalMark}
                            </span>
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0].submitted &&
                      submissionData.expertQuestions[0] &&
                      submissionData.expertQuestions[0].myfile.length > 0 && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                          <h1 className="text-xl font-bold">
                            Teacher Assessment File
                          </h1>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.expertQuestions[0] &&
                      submissionData.expertQuestions[0].myfile.length > 0 &&
                      submissionData.expertQuestions[0].myfile.map(
                        (file, index) => {
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
                        }
                      )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.peerQuestions[0].response.length > 0 &&
                      submissionData.expertQuestions.length > 0 &&
                      submissionData.expertQuestions[0]?.response.length >
                        0 && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-lg">
                          <h1 className="text-xl font-bold">
                            Response Got From Teacher
                          </h1>
                        </div>
                      )}
                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.peerQuestions[0].response.length > 0 &&
                      submissionData.expertQuestions.length > 0 &&
                      submissionData.expertQuestions[0]?.response.length > 0 &&
                      submissionData.expertQuestions[0].response.map(
                        (response, index) => {
                          return (
                            <div key={index}>
                              {response.responses.length > 0 && (
                                <div className="font-semibold font-roboto underline">
                                  {response.headingType}
                                </div>
                              )}

                              {response.responses.map((ques, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer"
                                  >
                                    <div>
                                      <div className="text-richblue-300 font-semibold min-w-[70%]">
                                        <p>
                                          {idx + 1}. {ques.question}
                                        </p>
                                      </div>
                                      <div>
                                        {ques.answer !== null && (
                                          <div className="min-w-[60%] text-sm font-roboto">
                                            <p className="font-roboto text-sm font-semibold ">
                                              Response :
                                            </p>

                                            {ques.answer}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {ques.answer === null && (
                                      <div className="bg-richblue-600 w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center ">
                                        <p>
                                          {ques.markGot}/{ques.actualMark}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.expertQuestions[0]?.submitted &&
                      submissionData.expertQuestions[0].response.length > 0 && (
                        <div>
                          <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-lg">
                            <h1 className="text-xl font-bold">Feedback</h1>
                            <div>
                              <img src={img26} alt="" className="w-10 " />
                            </div>
                          </div>
                          <div>
                            <textarea
                              type="text"
                              name="expertQuestion"
                              className="block w-full rounded-md border-0 py-1.5  font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                              placeholder="No Feedback"
                              rows={2}
                              value={submissionData.expertQuestions[0].feedback}
                            />
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.peerQuestions[0].response.length > 0 &&
                      submissionData.expertQuestions[0]?.submitted &&
                      submissionData.expertQuestions.length > 0 &&
                      submissionData.expertQuestions[0]?.response.length > 0 &&
                      submissionData.expertQuestions[0]?.myfile.length > 0 &&
                      submissionData.completed &&
                      submissionData.finalTask?.length > 0 && (
                        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
                          <h1 className="text-xl font-bold">Post Test</h1>
                          <div>
                            <img src={img28} alt="" className="w-10  " />
                          </div>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.peerQuestions[0].response.length > 0 &&
                      submissionData.expertQuestions[0]?.submitted &&
                      submissionData.expertQuestions.length > 0 &&
                      submissionData.expertQuestions[0]?.response.length > 0 &&
                      submissionData.expertQuestions[0]?.myfile.length > 0 &&
                      submissionData.completed &&
                      submissionData.finalTask?.length > 0 &&
                      submissionData.finalTask.map((file, index) => {
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

                    {submissionData &&
                      submissionData.peerQuestions.length > 0 &&
                      submissionData.peerQuestions[0]?.submitted &&
                      submissionData.peerQuestions[0].response.length > 0 &&
                      submissionData.expertQuestions[0]?.submitted &&
                      submissionData.expertQuestions.length > 0 &&
                      submissionData.expertQuestions[0]?.response.length > 0 &&
                      submissionData.expertQuestions[0]?.myfile.length > 0 &&
                      submissionData.completed &&
                      submissionData.finalTask?.length > 0 &&
                      submissionData.completed && (
                        <div className="flex justify-center text-lg items-center font-semibold font-roboto">
                          <p>
                            Great You Have Completed Your Assessment
                            Successfully !
                          </p>
                        </div>
                      )}

                    {submissionData &&
                      submissionData.completed &&
                      submissionData.commonfeedback &&
                      submissionData.finalTask?.length > 0 && (
                        <div>
                          <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-lg">
                            <h1 className="text-xl font-bold">
                              Expert Feedback
                            </h1>
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
                              value={submissionData.commonfeedback}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Mysubmission;
