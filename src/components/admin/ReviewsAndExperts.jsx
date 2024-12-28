import React from 'react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import { apiConnector } from '../../service/apiconnector'
import "../../pages/signin.css"
import toast, { Toaster } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../component/ui/tabs"
import { useSelector } from 'react-redux'
import { MdEmail } from "react-icons/md";
import { Button, } from "../../component/ui/button"

import Social from "../HomePage/Social"
const ReviewsAndExperts = () => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null);
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };
  const inputRef = useRef()
  const { token } = useSelector((state) => state.auth)
  const [expert, setExperts] = useState([])
  const [formData, setFormData] = useState({
    expertname: '',
    about: '',
    role: '',
    email: "",

  });

  const [loading, setLoading] = useState(false)

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setImage(file)

  };
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const submithandler = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    if (image) {
      formDataToSend.append(`image`, image);
    }

    try {
      setLoading(true)

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/experts`, formDataToSend, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      });


      if (result.data.Expert) {

        setExperts(result.data.Expert)
      }
      console.log(result)

      setFormData({
        expertname: '',
        about: '',
        role: '',
        email: "",

      })

      setImage(null)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed To Submit");

      console.error('An error occurred:', error);
    }

  }
  const deletehandler = async (event, id) => {
    event.preventDefault();

    try {
      setLoading(true)

      const result = await apiConnector('DELETE', process.env.REACT_APP_BASE_URL + `/api/v2/delete_experts/${id}`, null, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      });


      console.log(result)
      setLoading(false)

    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed To delete");

      console.error('An error occurred:', error);
    }

  }

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // console.log(id);
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/all_experts`, null, {
          Authorization: `Bearer ${token}`,
        });



        if (response.data.Experts) {
          setExperts(response.data.Experts)
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);


  function changehandler(event) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,


      }
    })
  }

  return (
    <div className='z-0 min-h-screen'>
      <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
        <div className='flex text-2xl gap-10 font-semibold items-center cursor-pointer max-w-4xl'>
          <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20' onClick={goBack}>
            <BiArrowBack />
          </div>

          <div>
            <span className='font-normal'>Add Reviews And Experts</span>
          </div>
        </div>




      </div>




      <div className='max-w-[90%] sm:max-w-4xl min-h-[100vh] mx-auto mt-8 mb-8'>


        <div className='shadow-lg p-6 rounded-md'>

          <Tabs defaultValue="Expert">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Expert">Expert</TabsTrigger>
              <TabsTrigger value="Review">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="Expert">
              <form>
                <div className="space-y-4">

                  <div className="border-b border-gray-900/10 pb-12">

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                          Expert name
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="expertname"
                              id="username"
                              autoComplete="username"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="janesmith"
                              onChange={changehandler}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                          Role
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="role"
                              id="username"
                              autoComplete="username"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="expert"
                              onChange={changehandler}

                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-full">
                        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                          About
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            defaultValue={''}
                            onChange={changehandler}

                          />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about expert.</p>
                      </div >
                      <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={changehandler}

                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                          Photo
                        </label>
                        <div className="mt-2 flex items-center gap-x-3" onClick={() => inputRef.current.click()}>
                          <input id="file-upload" name="file" type="file" className="sr-only" ref={inputRef} multiple hidden onChange={handleImageChange} />
                          {
                            image ? <img src={URL.createObjectURL(image)} className="h-12 w-12 object-cover rounded-full" /> : <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                          }
                          <button
                            type="button"
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            Change
                          </button>
                        </div>
                      </div>


                    </div >
                  </div >





                </div >



                <div className="mt-6 flex items-center justify-end gap-x-6">

                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={submithandler}
                  >
                    {loading ? <svg className='load' viewBox="25 25 50 50">
                      <circle r="20" cy="50" cx="50"></circle>
                    </svg> : <>
                      <p>  Submit</p>
                    </>

                    }

                  </button>


                </div>
              </form >

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10'>
                {expert.length > 0 && expert?.map((team, index) => (
                  <div key={index} className='min-h-[300px]  flex flex-col justify-center items-center  rounded-md p-4 shadow-xl'>

                    <div className='flex m-4 justify-end items-end '>
                      <Button variant='outline' onClick={(e) => deletehandler(e, team._id)}>

                        {loading ? <svg className='load' viewBox="25 25 50 50">
                          <circle r="20" cy="50" cx="50"></circle>
                        </svg> : <>
                          <p>Delete</p>
                        </>

                        }


                      </Button>
                    </div>

                    <div className='w-28 h-28 rounded-full flex justify-center items-center bg-gray-200'>
                      <img src={team.imageUrl} className='w-24 h-24 rounded-full object-cover' alt="" />
                    </div>


                    <div className='text-center'>
                      <h3 className='text-xl font-bold mb-2'>{team.expertname}</h3>
                      <p className='text-gray-400 font-semibold text-lg '>{team.role}</p>
                    </div>
                    <div className='mt-4 text-center text-richblue-700 '>


                      {expandedIndex === index ? team.about : `${team.about.substring(0, 100)}...`}


                      {team.about.length > 100 && (
                        <button
                          onClick={() => handleReadMore(index)}
                          className='text-blue-500 ml-2'
                        >
                          {expandedIndex === index ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>



                    <div className='m-2'>
                      <Social linkto={`mailto:${team.email}`}>
                        <MdEmail />
                      </Social>


                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div >


    </div >
  )
}

export default ReviewsAndExperts