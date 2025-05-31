import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import img22 from "../../assets/img22.png";
import { useSelector } from "react-redux";
import SelfAssessment from "./SelfAssessment";
import PeerSubmission from "./PeerSubmission";
import ExpertSubmission from "./ExpertSubmission";
import "@dotlottie/player-component";
import Footer from "../HomePage/Footer";
import animationData from "../../assets/lotties/course.lottie";
import submissionAnimation from "../../assets/lotties/submission.lottie";
import { BiHome } from "react-icons/bi";

function NewSubmission() {
  const [loading, setLoading] = useState(false);
  const { assignmentData, user } = useSelector((state) => state.profile);
  const [popupdata, setpopupData] = useState();
  const [selfsubmitted, setSelfsubmitted] = useState(false);
  let { params } = useParams();

  const forloading = (value) => {
    setLoading(value);
  };

  const popup = (data) => {
    setpopupData(data);
    setSelfsubmitted(data.selfsubmitted);
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  return (
    <div className="relative z-0">
      {selfsubmitted && (
        <div
          className="fixed h-screen w-screen bg-[#352067] bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setSelfsubmitted(false)}
        >
          <div className="bg-richblue-10 flex flex-col w-60 rounded-lg text-richblue-300 font-semibold justify-center items-center h-72 gap-4 relative z-50">
            <div className="absolute">
              <dotlottie-player
                autoplay
                playMode="normal"
                src={submissionAnimation}
                background="transparent"
                speed="0.5"
                style={{ width: "100vh", height: "100vh" }}
              />
            </div>

            <div className="flex flex-col justify-center items-center">
              <h1 className="font-bold ">Good Job!</h1>
              <p className="text-sm flex font-normal justify-center items-center">
                Your Response is Submitted
              </p>
              <p className="text-sm font-normal ">Successfully.</p>
            </div>

            <dotlottie-player
              autoplay
              playMode="normal"
              src={animationData}
              background="transparent"
              speed="0.5"
              style={{ width: "100px", height: "100px" }}
            />

            <div className="text-sm ">
              You Scored {popupdata?.marksGot} Out Of {popupdata?.selftotal}
            </div>
            <Link to="/students/dashboard">
              <div className=" border-[1px] border-richblue-400 rounded-2xl text-ichblue-400 text-sm flex justify-center items-center bg-[#F5E4F8] p-2">
                <button>BACK TO THE DASHBOARD</button>
              </div>
            </Link>
          </div>
        </div>
      )}
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
              {assignmentData?.assignmentTopic} -{" "}
              <span className="text-lg">{assignmentData?.assignmentType}</span>
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
              {/* self Submission */}
              {params === "self" && (
                <SelfAssessment forloading={forloading} popup={popup} />
              )}

              {/* PEER SUBMISSION */}
              {params === "peer" && (
                <PeerSubmission forloading={forloading} popup={popup} />
              )}

              {/* Teacher Submission */}

              {params === "expert" && (
                <ExpertSubmission forloading={forloading} popup={popup} />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default NewSubmission;
