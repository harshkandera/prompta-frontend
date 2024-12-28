import React from "react";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { apiConnector } from "../../service/apiconnector";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import img14 from "../../assets/img14.png";
import img13 from "../../assets/img13.png";
import Footer from "../HomePage/Footer";
import Img24 from "../../assets/img24.png";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { BiHome } from "react-icons/bi";

const Allassessment = () => {
  const [allassignment, setAllassignment] = useState([]);
  const { profile } = useSelector((state) => state.profileData);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/v2/get_assignment",
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // console.log(response.data.allassignments);
        setAllassignment(response.data.allassignments);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  function capitalizeWords(str) {
    if (typeof str !== "string") {
      return ""; // or any other default value you prefer
    }
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const isDatePassed = (startDate, endDate) => {
    if (startDate && endDate) {
      const currentDate = new Date();
      const startdate = new Date(startDate);
      const enddate = new Date(endDate);

      if (currentDate < startdate) {
        return {
          status: "Upcoming",
          color: "bg-red-500",
          borderColor: "border-red-500",
        };
      } else if (currentDate >= startdate && currentDate <= enddate) {
        return {
          status: "Ongoing",
          color: "bg-green-500",
          borderColor: "border-green-500",
        };
      } else if (currentDate > enddate) {
        return {
          status: "Completed",
          color: "bg-[#695FDC]",
          borderColor: "border-[#695FDC]",
        };
      }
    }

    // Return default values for other cases
    return {
      status: "Unknown",
      color: "bg-gray-500",
      borderColor: "border-gray-500",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
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
              <span className="font-normal">All Courses</span>
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
          <div className=" max-w-[90%] sm:max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xl">
              <h1 className=" text-xl font-semibold mt-8 mb-8">All Courses</h1>
              <div>
                <img src={img13} alt="" className="w-16 h-16 rounded-full" />{" "}
              </div>
            </div>
            <div>
              {allassignment && allassignment.length > 0 ? (
                allassignment
                  .slice(0)
                  .reverse()
                  .map((allassignment, index) => {
                    const { status, color, borderColor } = isDatePassed(
                      allassignment?.startDate,
                      allassignment?.dueDate
                    );
                    return (
                      <Link
                        to={`/students/course_page/${
                          allassignment._id
                        }/${capitalizeWords(allassignment.assignmentName)}`}
                      >
                        <div
                          key={index}
                          className={`text-richlue-900 bg-richblue-10 m-2 mb-4 p-2 rounded-md shadow-lg cursor-pointer border-l-8  hover:shadow-xl ${borderColor}
            }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex  justify-between   items-center ">
                              <div className="flex flex-col justify-center items-center">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                  <div className="bg-[#F6F5FA] w-16 flex rounded-md justify-center items-center h-20">
                                    <img src={img14} alt="" className="w-16 " />
                                  </div>
                                  <div className="flex flex-col justify-center items-center gap-2">
                                    <p className=" text-sm  font-bold ">
                                      {" "}
                                      Course Name
                                    </p>
                                    <div className="text-richblue-900  text-lg ml-4 ">
                                      {capitalizeWords(
                                        allassignment.assignmentName
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center items-center mt-0 mb-4 hidden sm:flex">
                                <p className=" text-sm  font-bold">Schedule</p>
                                <div className="text-xs  text-richblue-900   flex justify-center items-center mt-[12px] ">
                                  <p>
                                    {formatDate(allassignment.startDate)} -{" "}
                                    {formatDate(allassignment.dueDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center items-center mt-0">
                                <p className=" text-sm  mt-0 font-bold">
                                  Status
                                </p>
                                <div
                                  className={`text-xs flex justify-center m text-richblue-10 items-center w-[80px] h-[20px] ${color} rounded-md font-roboto  `}
                                >
                                  <p>{status}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
              ) : (
                <div className="mt-20">
                  <div className="mt-20">
                    <main class="grid min-h-full ">
                      <div className="text-center flex flex-col justify-center items-center">
                        <p className="text-base font-semibold text-indigo-600 w-[180px]">
                          <img src={Img24} alt="" />
                        </p>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                          No Course Available
                        </h1>
                        <div className="mt-10 flex items-center justify-center gap-x-6"></div>
                      </div>
                    </main>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer> </Footer>
    </div>
  );
};
export default Allassessment;
