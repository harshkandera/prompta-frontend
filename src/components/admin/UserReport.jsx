import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useParams, Link } from "react-router-dom";
import { apiConnector } from "../../service/apiconnector";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import img11 from "../../assets/img11.png";
import { useNavigate } from "react-router-dom";
import Img24 from "../../assets/img24.png";
import { FaCheck } from "react-icons/fa";
function UserReport() {
  const navigate = useNavigate();
  // const [peermarkGot, setPeermarkGot] = useState()
  const [usermarkGot, setUsermarkGot] = useState();
  // const [expertmarkGot, setExpertmarkGot] = useState()
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  // const [submissionData, SetsubmissionData] = useState();
  const [submission, setSubmissionData] = useState(null); // Correct state setter
  const [submissionData, SetsubmissionData] = useState();
  const [prepostdata, setprepostdata] = useState();
  const [totalMarks, setTotalMarks] = useState({
    user: 0,
    peer: 0,
    expert: 0,
  }); // Correct state setter

  const prePostChartOptions = {
    chart: {
      type: "bar",
      zoom: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    xaxis: {
      categories: ["Diagnostic", "Evaluative"],
      labels: {
        style: {
          colors: "#000000",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 50, // Adjust this range as needed
      labels: {
        style: {
          colors: "#000000",
        },
      },
      tickAmount: 5,
    },
  };

  const lineChartOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    xaxis: {
      categories: ["Self Assessment", "Peer Assessment", "Mentor Assessment"],
      labels: {
        style: {
          colors: "#000000",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "#000000",
        },
      },
      tickAmount: 5,
    },
  };

  const options = {
    options: {
      chart: {
        type: "bar",
      },

      tooltip: {
        theme: "dark", // Change to 'light' if you want a light-colored tooltip
        style: {
          background: "#9C27B0", // Change to the desired color for the tooltip background
          color: "#fff", // Change to the desired color for the tooltip text
        },
      },
      xaxis: {
        categories: ["Self Assessment", "Peer Assessment", "Mentor Assessment"],
        labels: {
          style: {
            colors: "#000000", // Change the color of y-axis labels here
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
        },
      },
      yaxis: {
        min: 0,
        max: 50,
        labels: {
          style: {
            colors: "#000000", // Change the color of y-axis labels here
          },
        },
        tickAmount: 5,
        formatter: function (value) {
          return value;
        },
      },
      grid: {
        show: false, // Set to false to hide background lines
      },
    },
  };
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const [chartData, setChartData] = useState([]);

  const { userId, name, AssignmentId } = useParams();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        // setLoading(true)

        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL +
            `/api/v2/get_submission/${userId}/${AssignmentId}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // console.log(response.data);
        SetsubmissionData(response.data.submission.courses);

        if (!response) {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${process.env.REACT_APP_BASE_URL}/api/v2/get_submission/${userId}/${AssignmentId}`,
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (response?.data?.submission) {
          const premarks = response?.data?.submission?.preMarks || 0;
          const postmarks = response?.data?.submission?.postMarks || 0;

          setprepostdata({
            series: [
              {
                name: "Pre and Post Marks",
                data: [premarks, postmarks],
              },
            ],
          });
        }

        if (response?.data?.submission?.courses) {
          setSubmissionData(response.data.submission.courses);

          // Aggregate total marks for all tasks
          const totals = response.data.submission.courses.reduce(
            (acc, course) => {
              const userTotal =
                course.assessment.userQuestions[0]?.totalMarkGot || 0;
              const peerTotal =
                course.assessment.peerQuestions[0]?.totalMarkGot || 0;
              const expertTotal =
                course.assessment.expertQuestions[0]?.totalMarkGot || 0;

              return {
                user: acc.user + userTotal,
                peer: acc.peer + peerTotal,
                expert: acc.expert + expertTotal,
              };
            },
            { user: 0, peer: 0, expert: 0 }
          );

          setTotalMarks(totals);
        }
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };
    fetchdata();
  }, [AssignmentId, token, userId]);

  useEffect(() => {
    if (submission) {
      const newChartData = submission.map((assessment) => {
        const peermarkGot =
          assessment.assessment.peerQuestions[0]?.totalMarkGot;

        const usermarkGot =
          assessment.assessment.userQuestions[0]?.totalMarkGot;

        const expertmarkGot =
          assessment.assessment.expertQuestions[0]?.totalMarkGot;

        return {
          usermarkGot: usermarkGot || 0,
          peermarkGot: peermarkGot || 0,
          expertmarkGot: expertmarkGot || 0,
        };
      });

      setUsermarkGot(newChartData);

      setChartData(
        newChartData.map((data) => ({
          series: [
            {
              name: "Assessment Report",
              data: [data.usermarkGot, data.peermarkGot, data.expertmarkGot],
            },
          ],
        }))
      );
    }
  }, [submission]);

  return (
    <div>
      <div className=" h-full min-h-screen">
        <div className="bg-richblue-600 h-full text-richblue-10 p-10">
          <div className="flex text-2xl gap-10 font-semibold items-center max-w-4xl">
            <div
              className="hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20"
              onClick={goBack}
            >
              <BiArrowBack />
            </div>

            <div>
              <span className="font-normal">{name}</span>
            </div>
          </div>
        </div>

        {submissionData && usermarkGot && usermarkGot.length > 0 ? (
          <>
            {/* Line Chart for Total Marks */}
            <div className="flex flex-col border-t-[16px] border-[#695FDC] gap-6 rounded-lg shadow-lg m-10 p-10">
              <h2 className="text-2xl font-semibold">
                Overall Assessment Scores
              </h2>
              <div id="line-chart" className="overflow-x-scroll rounded-lg p-2">
                <Chart
                  options={lineChartOptions}
                  series={[
                    {
                      name: "Total Scores",
                      data: [
                        totalMarks.user, // Total for Self Assessment
                        totalMarks.peer, // Total for Peer Assessment
                        totalMarks.expert, // Total for Mentor Assessment
                      ],
                    },
                  ]}
                  type="line"
                  height={300}
                  width={700}
                />
              </div>
            </div>
            {chartData?.map((data, index) => {
              return (
                <>
                  <div
                    className={`flex flex-col border-t-[16px]  border-[#695FDC]  gap-6 rounded-lg  shadow-lg m-10 p-10`}
                  >
                    <div className="text-2xl font-semibold ">
                      Task Name -{" "}
                      <span className="text-richblue-300">
                        {" "}
                        {submissionData[index].assessment.assignmentTopic}
                      </span>
                    </div>
                    {/* progress */}

                    <div className="flex flex-col gap-10 sm:flex-row ">
                      <div className="bg-gray-50 w-60 h-16 rounded-lg p-2">
                        <h1 className="text-gray-800 ">Self-assessment</h1>
                        <div className="flex gap-2 justify-center items-center">
                          <div className="w-[80%] bg-richblue-10 h-[9px] rounded-xl">
                            <div
                              className="bg-[#8075FF] h-[9px] rounded-xl"
                              style={{
                                width:
                                  usermarkGot[index].usermarkGot &&
                                  submissionData[index].assessment
                                    ?.userQuestions[0]?.totalMark !== 0
                                    ? `${
                                        (usermarkGot[index].usermarkGot /
                                          (submissionData[index].assessment
                                            ?.userQuestions[0]?.totalMark ||
                                            1)) *
                                        100
                                      }%`
                                    : "0",
                              }}
                            />
                          </div>
                          <div className="text-gray-800">
                            <span className="text-lg">
                              {usermarkGot[index].usermarkGot}/
                            </span>
                            <span className="opacity-75 text-sm">
                              {
                                submissionData[index].assessment
                                  ?.userQuestions[0]?.totalMark
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 w-60 h-16 rounded-lg p-2">
                        <h1 className="text-gray-800 ">Peer assessment</h1>
                        <div className="flex gap-2 justify-center items-center">
                          <div className="w-[80%] bg-richblue-10 h-[9px] rounded-xl">
                            <div
                              className="bg-[#8075FF] h-[9px] rounded-xl"
                              style={{
                                width:
                                  usermarkGot[index].peermarkGot &&
                                  submissionData[index].assessment
                                    ?.peerQuestions[0]?.totalMark !== 0
                                    ? `${
                                        (usermarkGot[index].peermarkGot /
                                          (submissionData[index].assessment
                                            ?.peerQuestions[0]?.totalMark ||
                                            1)) *
                                        100
                                      }%`
                                    : "0",
                              }}
                            />
                          </div>
                          <div className="text-gray-800 ">
                            <span className="text-lg">
                              {usermarkGot[index].peermarkGot}/
                            </span>
                            <span className="opacity-75 text-sm">
                              {
                                submissionData[index].assessment
                                  ?.peerQuestions[0]?.totalMark
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 w-60 h-16 rounded-lg p-2">
                        <h1 className="text-gray-800">Mentor assessment</h1>
                        <div className="flex gap-2 justify-center items-center">
                          <div className="w-[80%] bg-richblue-10 h-[9px] rounded-xl">
                            <div
                              className="bg-[#8075FF] h-[9px] overflow-hidden rounded-xl"
                              style={{
                                width:
                                  usermarkGot[index].expertmarkGot &&
                                  submissionData[index].assessment
                                    ?.expertQuestions[0]?.totalMark !== 0
                                    ? `${
                                        (usermarkGot[index].expertmarkGot /
                                          (submissionData[index].assessment
                                            ?.expertQuestions[0]?.totalMark ||
                                            1)) *
                                        100
                                      }%`
                                    : "0",
                              }}
                            />
                          </div>
                          <div className="text-gray-800">
                            <span className="text-lg">
                              {usermarkGot[index].expertmarkGot}/
                            </span>
                            <span className="opacity-75 text-sm">
                              {
                                submissionData[index].assessment
                                  ?.expertQuestions[0]?.totalMark
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="app overflow-x-scroll  rounded-lg p-2 w-full sm:max-w-[68%]">
                      <div id="chart">
                        <Chart
                          options={options.options}
                          series={data.series}
                          type="bar"
                          height={200}
                          width={700}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            <div className="flex flex-col border-t-[16px] border-[#695FDC] gap-6 rounded-lg shadow-lg m-10 p-10">
              <h2 className="text-2xl font-semibold">
                Profeciency Test
              </h2>
              <div className="app overflow-x-scroll  rounded-lg p-2 w-full sm:max-w-[68%]">
                <div id="chart">
                  <Chart
                    options={prePostChartOptions}
                    series={prepostdata.series}
                    type="bar"
                    height={200}
                    width={700}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-20">
            <main class="grid min-h-full ">
              <div class="text-center flex flex-col justify-center items-center">
                <p class="text-base font-semibold text-indigo-600 w-[180px]">
                  <img src={Img24} alt="" />
                </p>
                <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-500 sm:text-2xl">
                  No Submission found
                </h1>
                <div class="mt-10 flex items-center justify-center gap-x-6"></div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserReport;

{
  /* <div className='flex m-0 p-0 hidden sm:flex'>

<div className='flex '>

<div className='flex flex-col  justify-end items-end gap-2'>

<div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
<div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

{submissionData && submissionData.initialTask && submissionData.initialTask.length > 0 && <FaCheck />
}

</div>
</div>

<div className='font-semibold text-lg text-richblue-300'>
Pre Task
</div>


</div>



</div>
<div className='flex '>

  <div className='flex flex-col  justify-end items-end gap-2'>
    <div className='flex justify-center'>
      <div className='h-[3px] w-32 bg-richblue-300 mt-4 ml-0'>

      </div>
      <div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
        <div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

          {submissionData[index].assessment?.userQuestions[0]?.submitted && <FaCheck />
          }

        </div>
      </div>
    </div>



    <div className='font-semibold text-lg text-richblue-300'>
      Self Assessment
    </div>


  </div>


</div>
<div className='flex '>

  <div className='flex flex-col  justify-end items-end gap-2'>
    <div className='flex justify-center'>
      <div className='h-[3px] w-36 bg-richblue-300 mt-4 ml-0'>

      </div>
      <div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
        <div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

          {submissionData[index].assessment?.peerQuestions[0]?.submitted && <FaCheck />
          }


        </div>
      </div>
    </div>



    <div className='font-semibold text-lg text-richblue-300'>
      Peer Assessment
    </div>


  </div>


</div>
<div className='flex '>

  <div className='flex flex-col  justify-end items-end gap-2'>
    <div className='flex justify-center'>
      <div className='h-[3px] w-36 bg-richblue-300 mt-4 ml-0'>

      </div>
      <div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
        <div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

          {submissionData[index].assessment?.expertQuestions[0]?.submitted && <FaCheck />
          }


        </div>
      </div>
    </div>



    <div className='font-semibold text-lg text-richblue-300'>
      Mentor Assessment
    </div>


  </div>



</div>


<div className='flex '>

<div className='flex flex-col  justify-end items-end gap-2'>
<div className='flex justify-center'>
<div className='h-[3px] w-36 bg-richblue-300 mt-4 ml-0'>

</div>
<div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
<div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

{submissionData && submissionData.finalTask && submissionData.finalTask.length > 0 && <FaCheck />
}


</div>
</div>
</div>



<div className='font-semibold text-lg text-richblue-300'>
Post Task
</div>


</div>



</div>


<div className='flex '>

<div className='flex flex-col  justify-end items-end gap-2'>
<div className='flex justify-center'>
<div className='h-[3px] w-36 bg-richblue-300 mt-4 ml-0'>

</div>
<div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
<div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

{submissionData && submissionData.commonfeedback && <FaCheck />
}


</div>
</div>
</div>



<div className='font-semibold text-lg text-richblue-300'>
Expert Feeback
</div>


</div>



</div>

</div>




<div className='flex justify-start items-start sm:hidden'>



<div >
  <div className='flex flex-col  items-center'>

<div className='flex  justify-center items-center gap-2'>

<div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
<div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>
{submissionData && submissionData.initialTask && submissionData.initialTask.length > 0 && <FaCheck />
}
</div>
</div>

<div className='font-semibold text-lg text-richblue-300'>
Pre Task
</div>
</div>

<div className='h-6 w-[3px] bg-richblue-300'>

</div>
</div>
  <div className='flex flex-col  items-center'>

    <div className='flex justify-center items-center gap-2'>



      <div className='font-semibold text-lg text-richblue-300'>
        Self Assessment
      </div>
      <div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
        <div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

          {submissionData[index].assessment?.userQuestions[0]?.submitted && <FaCheck />
          }
        </div>
      </div>
    </div>

    <div className='h-6 w-[3px] bg-richblue-300'>

    </div>
  </div>
  <div className='flex flex-col  items-center'>
    <div className='flex  justify-center items-center gap-2'>

      <div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
        <div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

          {submissionData[index].assessment?.peerQuestions[0]?.submitted && <FaCheck />
          }
        </div>
      </div>
      <div className='font-semibold text-lg text-richblue-300'>
        Peer Assessment
      </div>
    </div>

    <div className='h-6 w-[3px] bg-richblue-300'>
    </div>
  </div>
  <div className='flex flex-col  items-center'>
    <div className='flex  justify-center items-center gap-2'>


      <div className='font-semibold text-lg text-richblue-300'>
        Mentor Assessment
      </div>
      <div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
        <div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>
          {submissionData[index].assessment?.expertQuestions[0]?.submitted && <FaCheck />
          }

        </div>
      </div>
    </div>

    <div className='h-6 w-[3px] bg-richblue-300'>

    </div>
  </div>

  <div className='flex flex-col  items-center'>
<div className='flex  justify-center items-center gap-2'>


<div className='font-semibold text-lg text-richblue-300'>
Post Task
</div>
<div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
<div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

{submissionData && submissionData.finalTask && submissionData.finalTask.length > 0 && <FaCheck />
}

</div>
</div>

</div>
<div className='h-6 w-[3px] bg-richblue-300'>

</div>

</div>


  <div className='flex flex-col  items-center'>
<div className='flex  justify-center items-center gap-2'>



<div className='border-2 border-richblue-300 w-8 h-8 rounded-full flex justify-center items-center'>
<div className='w-6 h-6 bg-richblue-300 rounded-full text-richblue-10 flex justify-center items-center'>

{submissionData && submissionData.commonfeedback && <FaCheck />
}


</div>
</div>
<div className='font-semibold text-lg text-richblue-300'>
Exper Feedback
</div>
</div>

</div>
</div>

</div> */
}
