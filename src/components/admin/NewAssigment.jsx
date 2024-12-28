import React from 'react'
import Navbar from "../user/Navbar"
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../service/apiconnector'
import toast, { Toaster } from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx"
import img13 from "../../assets/img13.png"
import img11 from "../../assets/img11.png"
import img15 from "../../assets/img15.png"
import Footer from "../HomePage/Footer"
import { Link } from "react-router-dom"
import { Button, } from "../../component/ui/button"
import { cn } from '../../lib/utils'
import { Checkbox } from "../../component/ui/checkbox"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from 'react-router-dom';
import Folder from "../../assets/IconSvg"

const NewAssigment = () => {
    const today = new Date();

    // Get the date in India Standard Time
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const indiaDate = new Intl.DateTimeFormat('en-IN', options).format(today);
    
    // Format the date string as YYYY-MM-DD
    const [day, month, year] = indiaDate.split('/');
    const minDate = `${year}-${month}-${day}`;
  
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [postVisible, setPostVisible] = useState(false)
    const [profMandatory, setProfMandatory] = useState(false)
    const [profMarksVisible, setProfMarksVisible] = useState(false)

    const navigate = useNavigate()

    const [formData, setFormData] = useState({ 
        assignmentName: "", 
        dueDate: "", 
        startDate: "", 
        description: "", 
        instructorName: "", 
        instructorDetails: "", 
        experts: "", 
        assessmentType: "",
        preTestTopic: "",
        postTestTopic: "" 
    });

    const { assignmentName, dueDate, startDate, description, instructorName, instructorDetails, experts, assessmentType, preTestTopic, postTestTopic } = formData;

    const goBack = () => {
        navigate(-1);
    };

    function changehandler(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            }
        })
    }

    const [groups, setGroups] = useState()
    const [maxStudent, setMaxstudent] = useState()

    const cancelhandle = (e) => {
        e.preventDefault();
        setFormData({ 
            assignmentName: "", 
            dueDate: "", 
            startDate: "", 
            description: "", 
            instructorName: "", 
            instructorDetails: "", 
            experts: "", 
            assessmentType: "",
            preTestTopic: "",
            postTestTopic: "" 
        });

        setGroups()
        setMaxstudent()
        setProfMandatory(false)
        setPostVisible(false)
    }

    const submithandler = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();

        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        formDataToSend.append('groups', JSON.stringify(groups));
        formDataToSend.append('maxStudent', JSON.stringify(maxStudent));
        formDataToSend.append('postTaskVisible', JSON.stringify(postVisible));
        formDataToSend.append('profMandatory', JSON.stringify(profMandatory));
        formDataToSend.append('profMarksVisible', JSON.stringify(profMarksVisible));

        try {
            setLoading(true);

            const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + '/api/v2/new_assignment', formDataToSend, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            });

            console.log(result);
            if (!result.data.success) {
                throw new Error(result.data.message);
            }
            setLoading(false);
            setGroups()
            setMaxstudent()
            setFormData({ 
                assignmentName: "", 
                dueDate: "", 
                startDate: "", 
                description: "", 
                instructorName: "", 
                instructorDetails: "", 
                experts: "", 
                assessmentType: "",
                preTestTopic: "",
                postTestTopic: "" 
            });

            toast.success('Assignment Created Successfully');

        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Failed To Create Assignment");

            console.error('An error occurred:', error);
        }
    };



    return (

        <div >
            {loading ? (<div className='flex justify-center items-center h-[100vh] sm:signinbg'>
                <div class="spinner"></div>

            </div>) : (
                <div className='h-full min-h-screen' >
                    <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
                        <div className='flex text-2xl gap-10 font-semibold items-center cursor-pointer max-w-4xl'>
                            <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20' onClick={goBack}>
                                <BiArrowBack />
                            </div>

                            <div>
                                <span className='font-normal'>Create Course</span>
                            </div>
                        </div>




                    </div>


                    <div className='max-w-[80%] sm:max-w-4xl mx-auto text-richblue-900 mt-10' >

                        <div className=' mt-10 mb-10 ml-2 flex items-center gap-2 text-xl'>
                            <h1 className='text-xl font-bold font-inter'>Ready set Go!</h1>
                            <div >
                                <img src={img13} alt="" className='w-16 h-16 rounded-full' />

                            </div>
                        </div>

                        <form encType="multipart/form-data">
                            <div >
                                <div className=" pb-12">


                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-4">
                                            <label htmlFor="assignmentName" className="block leading-6 font-medium ">
                                                Course Name
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <input
                                                        type="text"
                                                        name="assignmentName"
                                                        value={assignmentName}
                                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="Course Name"
                                                        onChange={changehandler}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-span-full">
                                            <label htmlFor="about" className="block  leading-6 font-medium">
                                                Course Description
                                            </label>
                                            <div className="mt-2">
                                                <textarea
                                                    id="about"
                                                    name="description"
                                                    value={description}
                                                    rows={3}
                                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    defaultValue={''}
                                                    placeholder='Description'
                                                    onChange={changehandler}
                                                />
                                            </div>
                                        </div>



                                    </div>



                                </div>





                                <div className="">


                                    <div className=" grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-6">




                                        <div className="sm:col-span-6">

                                            <div className="flex items-center space-x-2  my-4">
                                                <Checkbox id="terms" checked={postVisible} onCheckedChange={() => { setPostVisible(!postVisible) }} />
                                                <label
                                                    htmlFor="terms"
                                                    className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    PostTask Visibility
                                                </label>
                                            </div>


                                        </div>

                                        <div className="sm:col-span-3">

                                            <div className="flex items-center space-x-2  my-4">
                                                <Checkbox id="terms" checked={profMandatory} onCheckedChange={() => { setProfMandatory(!profMandatory) }} />
                                                <label
                                                    htmlFor="terms"
                                                    className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Proficiency Mandatory
                                                </label>
                                            </div>


                                        </div>

                                        <div className="sm:col-span-3 ">


                                            <div className="flex items-center space-x-2 my-4">
                                                <Checkbox id="terms" checked={profMarksVisible} onCheckedChange={() => { setProfMarksVisible(!profMarksVisible) }} />
                                                <label
                                                    htmlFor="terms"
                                                    className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Proficiency Marks Visible
                                                </label>
                                            </div>



                                        </div>



                                        <div className="sm:col-span-3">

                                            <label htmlFor="AssignmentDate" className='font-medium text-richblue-900 mb-2 '>Set Start date</label>

                                                <input type="date" className='block w-[200px] rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                                    value={startDate}
                                                    name="startDate"
                                                    min={minDate}

                                                    onChange={changehandler}
                                                />
                                            </div>

                                            <div className="sm:col-span-3">

                                            <label htmlFor="AssignmentDate" className='font-medium text-richblue-900 mb-2 '>Set Due date</label>
                                            <input type="date" className='block w-[200px] rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                                value={dueDate}
                                                name="dueDate"
                                                min={startDate}

                                                onChange={changehandler}
                                            />

                                        </div>


                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block font-medium mb-2 leading-6 ">
                                                Groups
                                            </label>
                                            <div>
                                                <input
                                                    type="number"
                                                    className='block w-[100px] rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                                    min={1}
                                                    max={26}
                                                    onChange={(e) => setGroups(Math.min(Math.max(parseInt(e.target.value) || 0, 1), 26))}
                                                    value={groups}
                                                    placeholder='0'
                                                />
                                            </div>


                                        </div>



                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block font-medium mb-2 leading-6 ">
                                                Group limit
                                            </label>
                                            <div>
                                                <input type="number" className='block w-[100px] rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' min={1}
                                                    onChange={(e) => setMaxstudent(Math.min(Math.max(parseInt(e.target.value) || 0, 1)))}
                                                    placeholder='0'
                                                    value={maxStudent} />
                                            </div>


                                        </div>


                            {/* New fields for Pre and Post Test Topics */}
                            <div className="sm:col-span-3">
                                <label htmlFor="preTestTopic" className="block font-medium mb-2 leading-6">
                                    Pre-Test Topic
                                </label>
                                <div>
                                    <textarea
                                        id="preTestTopic"
                                        name="preTestTopic"
                                        value={preTestTopic}
                                        rows={1}
                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Pre-Test Topic"
                                        onChange={changehandler}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="postTestTopic" className="block font-medium mb-2 leading-6">
                                    Post-Test Topic
                                </label>
                                <div>
                                    <textarea
                                        id="postTestTopic"
                                        name="postTestTopic"
                                        value={postTestTopic}
                                        rows={1}
                                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Post-Test Topic"
                                        onChange={changehandler}
                                    />
                                </div>
                            </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block font-medium  mb-2 leading-6 ">
                                                Instructor Name
                                            </label>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="instructorName"
                                                    value={instructorName}
                                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    placeholder="Instructor Name"
                                                    onChange={changehandler}
                                                />
                                            </div>


                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block font-medium mb-2 leading-6 ">
                                                Instructor Details
                                            </label>
                                            <div>
                                                <textarea
                                                    id="about"
                                                    name="instructorDetails"
                                                    value={instructorDetails}
                                                    rows={1}
                                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    defaultValue={''}
                                                    placeholder='Instructor Details'
                                                    onChange={changehandler}
                                                />
                                            </div>






                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block font-medium  mb-2 leading-6 ">
                                                Assessment Type
                                            </label>
                                            <div>
                                                <textarea
                                                    type="text"
                                                    name="assessmentType"
                                                    value={assessmentType}
                                                    rows={1}
                                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    defaultValue={''}
                                                    placeholder="assessment type"
                                                    onChange={changehandler}
                                                />
                                            </div>


                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="country" className="block font-medium mb-2 leading-6 ">
                                                Experts
                                            </label>
                                            <div>
                                                <textarea
                                                    id="about"
                                                    name="experts"
                                                    value={experts}
                                                    rows={1}
                                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    defaultValue={''}
                                                    placeholder='experts name'
                                                    onChange={changehandler}
                                                />
                                            </div>






                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="border-b border-gray-900/10 pb-12" />
                            <div className='flex justify-end items-center my-16 gap-4'>

                                <Button variant='outline' onClick={cancelhandle}>
                                    Cancel
                                </Button>
                                <Button variant='btn' onClick={submithandler}>
                                    Create Course
                                </Button>

                                <Toaster />
                            </div>

                        </form>
                    </div>
                </div>
            )}

            <Footer></Footer>

        </div>)
}

export default NewAssigment;