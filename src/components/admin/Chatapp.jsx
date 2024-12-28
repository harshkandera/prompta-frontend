import React from 'react'
import { BiArrowBack } from "react-icons/bi"
import { IoSearch } from "react-icons/io5";
import { useEffect, useState, useRef ,useMemo} from 'react';
import { useSelector } from 'react-redux'
import { apiConnector } from '../../service/apiconnector'
import img12 from "../../assets/img12.jpg"
import toast from 'react-hot-toast';
import img30 from "../../assets/img30.png"
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import io from 'socket.io-client';
const Chatapp = () => {
  const { token } = useSelector((state) => state.auth)
  const [alluser, setAlluser] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchterm, setSearchterm] = useState('')
  const [chatuser, setChatuser] = useState()
  const [chats, setChats] = useState()
  const [reciever_id, setReciever_id] = useState()
  const [reciever, setReciever] = useState()
  const [messages, setMessages] = useState([])
  const userinfo = useSelector((state) => state.profile)
  const [content, setContent] = useState('')
  // const [socket, setSocket] = useState()
  const messagesContainerRef = useRef(null);
  const [showuser, setShowuser] = useState(false)
const [switchusers,setSwichusers] =useState(false)
const [allchats,setAllchats]=useState()
const { profile } = useSelector((state) => state.profileData);
const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
    socket.disconnect();

  };

  window.addEventListener('popstate', (event) => {
    socket.disconnect();

  });

  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        withCredentials: true,
      }),
    []
  );


  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connected", socket.id);
      });

      socket.emit("addUser", userinfo.user._id);

      const handleGetUser = (users) => {
        console.log("active users are:", users);
      };

      const handleGetMessage = (data) => {
        // console.log('Data received:', JSON.stringify(data, null, 2));
        setChats(data);
      };
      socket.on("getUser", handleGetUser);
      socket.on("getMessage", handleGetMessage);

    }
    // return () => {
    //   socket.disconnect();
    // };

  }, [socket]);




  useEffect(() => {
    if (chats?.sender && chats.sender?._id === reciever_id) {
      setMessages((prev) => [...prev, chats]);
    }
  

    // console.log(reciever_id)
  }, [chats])

  const showusers = () => {
    setShowuser(!showuser);
    // console.log(showuser)
  }

// useEffect(()=>{
//   console.log(messages)
// },[messages])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the default behavior of the Enter key (e.g., form submission)
      sendmessage();
    }
  };



  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC", // Set the time zone to UTC to match the provided timestamp
  };


  useEffect(() => {
    const fetchdata = async () => {
      try {


        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_user_bysearch?searchTerm=${searchterm}`, null, {
          Authorization: `Bearer ${token}`,
        });

        // console.log(response.data);
        setAlluser(response.data.users)


      } catch (error) {

        console.log(error);
      }
    }

    fetchdata();

  }, [searchterm]);



  const startchat = async (user) => {
    try {
      // Set loading state to true
      setLoading(true);

      // Set chat user, receiver ID, and receiver
      setChatuser(user);
      setReciever_id(user.profile._id);
      setReciever(user._id);

      // Log user information
      // console.log(userinfo.user.profile);
      // console.log(userinfo.user._id, user._id);

      // Make API request to create or retrieve chat
      if (user) {
        const response = await apiConnector('GET', `${process.env.REACT_APP_BASE_URL}/api/create_chat?sender_id=${userinfo.user._id}&reciever_id=${user._id}`, null, {
          Authorization: `Bearer ${token}`,
        });

        // console.log(response);



        // Check if chat exists in the response
        if (response.data.chat !== null) {
          // Update messages state with chat messages
          setMessages(response.data.chat.messages);
        } else {
          // If no chat exists, set messages state to an empty array
          setMessages([]);
        }
      }
    } catch (error) {
      // Handle errors (e.g., display an error message to the user)
      console.error(error);
    } finally {
      // Set loading state to false after the asynchronous operations are complete
      setLoading(false);
    }
  };

  
  const allconversation = async () => {
    try {

      setSwichusers(true);

      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/all_chats`, null, {
        Authorization: `Bearer ${token}`,
      });
        // console.log(response);

setAllchats(response.data.chat);

   
    } catch (error) {
      // Handle errors (e.g., display an error message to the user)
      console.error(error);
    }
  };



 



  const sendmessage = async () => {
    try {
      if (content === '') {
        toast.error('Empty message cannot be sent');
      } else {
        const message = {
          sender: userinfo.user.profile,
          reciever: reciever_id, // Corrected the spelling to "receiver"
          content: content,
        };

        // console.log(message);

        const response = await apiConnector(
          'POST',
          `${process.env.REACT_APP_BASE_URL}/api/start_chat?sender_id=${userinfo.user._id}&reciever_id=${reciever}`,
          message,
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Set the Content-Type header
          }
        );
        // console.log(response.data)

        let sentchat = response.data.updatedChat.messages
        const newReciever_id = response.data.updatedChat.participants.find((participant) => participant !== userinfo.user._id);
        // console.log(sentchat[sentchat.length - 1]);

        setContent('');
        setMessages((prev) => [...prev, sentchat[sentchat.length - 1]])
        // Send the message and reciever_id with socket emit
        socket?.emit('sendMessage', {
          message: sentchat[sentchat.length - 1],
          reciever_id: newReciever_id,
        });


    


      }
    } catch (error) {
      console.error(error);

    }
  };



  const selectuser = (user) => {
    // Determine the ID of the selected user
    let id;
    userinfo.user._id === user.participants[0] ? (id = user.participants[1]) : (id = user.participants[0]);
  
    // Determine the profile object based on the current user's role in the chat
    const profileObj =
      profile._id === user.messages[0]?.reciever?._id ? user.messages[0]?.sender : user.messages[0]?.reciever;
  
    // Create a final user object with the selected user's ID and profile information
    const finalUser = {
      _id: id,
      profile: profileObj,
    };
  
    // Call the startChat function with the final user object
    startchat(finalUser);
  };
  

  return (
    <div className='overflow-hidden relative'>

      <div className='w-12 h-12 absolute rounded-full  cursor-pointer right-0 top-[40%] flex justify-center richblue-500 text-2xl items-center' onClick={showusers}>
        <IoIosArrowBack />
      </div>

      <div className='w-screen h-screen flex flex-row font-roboto'>

        <div className='h-screen w-[1px] bg-[#000000] opacity-5'>

        </div>
        <div className='h-screen w-[100%]  shadow-lg '>
          <div className=' h-[10%] w-full flex gap-4 bg-richblue-600 rounded-b-xl'>
          <div className='hover:bg-richblue-10 h-10 w-10 rounded-full text-richblue-10 text-2xl cursor-pointer mt-4 ml-2 flex justify-center items-center hover:bg-opacity-20' onClick={goBack}>
            <BiArrowBack />
          </div>
          
            {chatuser && <div className='flex gap-2 items-center p-4'>

              <div className='flex flex-row gap-2 items-center'>
                <div className='w-[36px] h-[36px] rounded-full bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${img12})` }}>
                  <img src={chatuser && chatuser.profile && chatuser.profile.image} alt="" className='w-8 h-8 rounded-full' />

                </div>

                <p className='font-medium text-richblue-10 text-lg'>
                  {chatuser && chatuser.profile && chatuser.profile.firstname}
                </p>
              </div>
            </div>

            }



          </div>
          <div className='w-full h-[1px] bg-[#000000] opacity-5 shadow-lg'>

          </div>
          <div className='h-[80%] overflow-y-scroll scrollbar'>

            {chatuser ? (
              <div>
                <div className='mt-4'>
                  {loading ? (
                    <div className='flex justify-center items-center h-[100vh] sm:signinbg'>
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <div ref={messagesContainerRef} className="your-messages-container-style scrollbar" style={{ overflowY: 'auto', maxHeight: '500px' }}>
                      {messages.map((message, index) => (
                        message.sender._id === userinfo.user.profile ? (
                          <div key={index} className='w-full flex justify-end'>
                            <div className='flex mb-2 flex-col w-[45%]'>
                              <div className='flex justify-end mb-2 text-[#ffffff]'>
                                <p className='min-w-[45%] bg-[#1D88F6] rounded-lg p-2  mr-4'>{message.content}</p>
                              </div>
                              <div className='flex justify-center my-2'>
                                {message.timestamp && (
                                  <p className='text-xs opacity-60'>{new Date(message.timestamp).toLocaleString("en-US", options)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={index} className='flex ml-2'>
                            <div className='flex flex-col w-[45%] items-center my-2'>
                              <div className='flex mb-2 w-full'>
                                <div className='w-full flex gap-[2px] items-center'>
                                  <div className='min-w-[28px] min-h-[28px] rounded-full bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${img12})` }}>
                                    {message.sender && <img src={message.sender.image} alt="User Profile" className='w-6 h-6 rounded-full' />}
                                  </div>
                                  <div>
                                    <p className='w-full bg-[#ffffff] rounded-lg p-2  ml-4'>{message.content}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                {message.timestamp && (
                                  <p className='text-xs opacity-60'>{new Date(message.timestamp).toLocaleString("en-US", options)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='h-full flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center'>
                  <div>
                    <img src={img30} alt="" className='w-52' />
                  </div>
                  <div>
                    <p className='font-semibold text-xl text-gray-700'>Select User To Start Conversation</p>
                  </div>
                </div>
              </div>
            )}





          </div>
          <div className='w-full h-[1px] bg-[#000000] opacity-5 shadow-lg'>

          </div>

          <div className='h-[10%] '>
            <div className='flex flex-row h-full justify-center items-center'>
              <input type="text" className='w-[90%] h-full outline-none focus:outline-0 border-0 number-input bg-[#F8F9FD]' placeholder='Type a message here ...' value={content}
                onChange={(e) => { setContent(e.target.value) }}
                onKeyPress={handleKeyPress}
              />
              <button className='w-26 h-10 btn-send' onClick={() => sendmessage()}>
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Send</span>
              </button>
            </div>

          </div>

        </div>
        <div className='h-screen w-[1px] bg-[#000000] opacity-5 '>

        </div>

        <div className={`h-screen absolute top-0 right-0 transition-all duration-300 ease-in-out overflow-hidden bg-richblue-500 text-richblue-10 sm:rounded-l-lg  ${showuser ? 'w-[100%] sm:w-[25%] ' : 'w-0'}`}  >
          <div className=' h-[10%] w-full '>


            <div className='flex flex-row items-center justify-center h-12 m-4 '>
              <div className='w-[10%] h-full flex justify-end items-center text-xl  rounded-full'><IoSearch /></div>
              <input type="text" placeholder='search here ...' className='w-[90%]  rounded-full text-[#000000] border-0 number-input'
                value={searchterm}
                onChange={(e) => { setSearchterm(e.target.value); }}
              />
            </div>


          </div>
          <div className='w-full h-[1px] bg-[#000000] opacity-5 shadow-lg'></div>

          <div className=' h-[10%] w-full flex  gap-8 items-center font-medium text-[#1D88F6] ml-8'>

            <p className={`${!switchusers && 'border-b-2 border-[#1D88F6]'} cursor-pointer`} onClick={() => { setSwichusers(false) }}>All Students</p>

            <p className={`${switchusers && 'border-b-2 border-[#1D88F6]'} cursor-pointer`} onClick={allconversation}>All Conversation</p>
          </div>
          <div className='w-full h-[1px] bg-[#000000] opacity-5 shadow-lg'></div>
          {switchusers ? <div className='overflow-y-scroll h-[80%] scrollbar' onClick={showusers}>


            {allchats &&
              allchats.map((user, index) => (

                (
                  <div className='hover:bg-[#1D88F6]  rounded-full' key={index}>
                    <div className='flex flex-row gap-2 p-2 items-center cursor-pointer' onClick={() => selectuser(user)}>
                      <div className='w-[45px] h-[45px] rounded-full bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${img12})` }}>
                        {profile._id === user.messages[0]?.reciever?._id ? <img src={user.messages[0]?.sender?.image} className='w-10 h-10 rounded-full' /> : <img src={user.messages[0]?.reciever?.image} className='w-10 h-10 rounded-full' />

                        }
                      </div>
                      <div>
                        <p className='text-md '>
                          {profile._id === user.messages[0]?.reciever?._id ? user.messages[0]?.sender?.firstname : user.messages[0]?.reciever?.firstname

                          }
                        </p>
                        <div className='flex justify-center gap-2 items-center'>
                          {profile._id === user.messages[user.messages.length - 1]?.reciever?._id && user.messages?.length > 0 &&  <div className='w-2 h-2 rounded-full bg-[#1D88F6]'>

</div>

                          }
                         
                        <p className='text-xs text-[#1D88F6]'>   {profile._id === user.messages[user.messages.length - 1]?.reciever?._id && user.messages?.length > 0 && user.messages[user.messages.length - 1].content}</p>
                        </div>
                        
                      </div>
                    </div>
                    <div className='w-full h-[1px] bg-[#1D88F6] opacity-20 shadow-lg'></div>
                  </div>
                )
              ))
            }

          </div>
            :
            

            <div className='overflow-y-scroll h-[80%] scrollbar' onClick={showusers}>


              {
                alluser.map((user, index) => (
                  user._id !== userinfo.user._id && (
                    <div className='hover:bg-[#1D88F6]  rounded-full' key={index}>
                      <div className='flex flex-row gap-2 p-2 items-center cursor-pointer' onClick={() =>startchat(user)}>
                        <div className='w-[45px] h-[45px] rounded-full bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${img12})` }}>
                          {user.profile && user.profile.image && <img src={user.profile.image} alt="User Profile" className='w-10 h-10 rounded-full' />}
            </div>
            <div>
              <p className='text-md '>{user.profile.firstname}</p>
              <p className='text-xs font-medium'>{user.profile.rollnumber}</p>
            </div>
          </div>
          <div className='w-full h-[1px] bg-[#1D88F6] opacity-20 shadow-lg'></div>
        </div>
      )
    ))
  }

</div>



}


        </div>




      </div>

    </div>
  )
}

export default Chatapp;