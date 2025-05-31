import React from 'react'
import Navbar from "../components/user/Navbar"
import Folder from "../assets/folder"
import { Link } from 'react-router-dom';
import Footer from '../components/HomePage/Footer'

const User = () => {
  return (
    <div>
      <div className="min-h-screen font-inter">
        <Navbar></Navbar>
        <div className="max-w-[90%] sm:max-w-4xl mx-auto ">
          <div className="flex flex-col sm:flex-row  mt-8  justify-between items-center">
            <Link to="/students/all_assessments">
              <div className="flex flex-col cursor-pointer p-4 rounded-sm hover:bg-gray-100 justify-center items-center">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  width="240px"
                  height="240px"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <polygon
                      style={{ fill: "#0D91BA" }}
                      points="197.816,82.912 168.728,48 58.184,48 23.272,82.912 23.272,129.456 488.728,129.456 488.728,82.912"
                    />
                    <rect
                      y="129.456"
                      style={{ fill: "#25B6D2" }}
                      width="512"
                      height="334.544"
                    />
                    <rect
                      x="52.36"
                      y="106.184"
                      style={{ fill: "#FFFFFF" }}
                      width="407.272"
                      height="23.272"
                    />
                  </g>
                </svg>
                <div className="text-xl pb-6 font-bold ">All Courses</div>
              </div>
            </Link>

            <Link to="/students/new_assessment">
              <div className="flex cursor-pointer p-4 rounded-sm hover:bg-gray-100 flex-col justify-center  items-center">
                <Folder />

                <div className="text-xl pb-6 font-bold ">My Course</div>
              </div>
            </Link>

            <Link to="/students/my_reports">
              <div className="flex flex-col cursor-pointer p-4 rounded-sm hover:bg-gray-100 justify-center items-center">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  width="240px"
                  height="240px"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <polygon
                      style={{ fill: "#0D91BA" }}
                      points="197.816,82.912 168.728,48 58.184,48 23.272,82.912 23.272,129.456 488.728,129.456 488.728,82.912"
                    />
                    <rect
                      y="129.456"
                      style={{ fill: "#25B6D2" }}
                      width="512"
                      height="334.544"
                    />
                    <rect
                      x="52.36"
                      y="106.184"
                      style={{ fill: "#FFFFFF" }}
                      width="407.272"
                      height="23.272"
                    />
                  </g>
                </svg>
                <div className="text-xl pb-6 font-bold ">My Reports</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default User;