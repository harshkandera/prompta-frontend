import React from "react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../../service/apiconnector";
import toast, { Toaster } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import img13 from "../../assets/img13.png";
import img11 from "../../assets/img11.png";
import img15 from "../../assets/img15.png";
import Footer from "../HomePage/Footer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../../component/ui/button";
import { cn } from "../../lib/utils";
import { Checkbox } from "../../component/ui/checkbox";
import { BiArrowBack } from "react-icons/bi";
import { Input } from "../../component/ui/input";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../component/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../component/ui/card";
import { Badge } from "../../component/ui/badge";
function Alltasks() {
  const navigate = useNavigate();
  const { name } = useParams();
  const [alltasks, setAlltasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [allType, setAllType] = useState();
  const [assignmentTypeNew, setAssignmentTypeNew] = useState();
  const [loading, setLoading] = useState(false);
  const [Visibility, setVisibility] = useState(false);
  const [attachlinks, setAttachlinks] = useState([]);
  const [linkurl, setLinkurl] = useState("");

  const today = new Date();

  // Get the date in India Standard Time
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const indiaDate = new Intl.DateTimeFormat("en-IN", options).format(today);

  // Format the date string as YYYY-MM-DD
  const [day, month, year] = indiaDate.split("/");
  const minDate1 = `${year}-${month}-${day}`;

  const [minDate, setMinDate] = useState();
  const inputRef = useRef();

  const [file, setFiles] = useState([]);

  const { token } = useSelector((state) => state.auth);

  const [update, setUpdate] = useState(false);
  const [update1, setUpdate1] = useState(false);

  const [index1, setIndex1] = useState();
  const { id } = useParams();
  const [assignmentfileUrl, setassignmentfileUrl] = useState([]);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  const [taskdata, setTaskData] = useState({
    assignmentTopic: "",
    assignmentType: assignmentTypeNew,
    startDate: "",
    lastDate: "",
  });

  const { assignmentTopic, assignmentType, lastDate, startDate } = taskdata;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  function changehandler2(event) {
    setTaskData((prevTaskData) => {
      return {
        ...prevTaskData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const filtertasks = (index) => {
    // Reset update states
    setUpdate(false);
    setUpdate1(false);

    // Filter out the task at the specified index
    const updatetasks = alltasks.filter((task, i) => i !== index);

    // Update the alltasks state with the filtered tasks
    setAlltasks(updatetasks);

    // Reset task data and visibility state
    setTaskData({
      assignmentTopic: "",
      assignmentType: "",
      startDate: "",
      lastDate: "",
    });
    setVisibility(false);
  };

  // useEffect to log taskData after it updates
  useEffect(() => {
    console.log("all tasks", alltasks);
    console.log(" tasks", tasks);
  }, [alltasks, tasks]);

  const filtertasks1 = (index) => {
    // Reset update states
    setUpdate(false);
    setUpdate1(false);

    const updatetasks = tasks.filter((links, i) => {
      return i !== index;
    });

    setTasks(updatetasks);
    // Reset task data and visibility state
    setTaskData({
      assignmentTopic: "",
      assignmentType: "",
      startDate: "",
      lastDate: "",
    });
    setItems([]);
    setVisibility(false);

    console.log("here is all tasks", taskdata);
  };

  const handleFileChange = (event) => {
    const newFiles = [...file, event.target.files];

    setFiles(newFiles);
    console.log(file);
  };

  const filterlinks = (index) => {
    const updatelinks = attachlinks.filter((links, i) => {
      return i !== index;
    });
    setAttachlinks(updatelinks);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (files.length > 0) {
      setFiles([...file, files]);
    }
    console.log(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  };

  function deletehandle(index) {
    const updated = file.filter((file, i) => i !== index);
    setFiles(updated);
  }

  const Addlinks = (e) => {
    e.preventDefault();

    if (linkurl !== "") {
      setAttachlinks((prevLinks) => [...prevLinks, { linkurl: linkurl }]);
      setLinkurl("");
      toast.success("Link added");
    } else {
      toast.error("Please provide a link");
    }
  };

  const handleLinkChange = (e) => {
    setLinkurl(e.target.value);
  };

  useEffect(() => {
    console.log(alltasks);
  }, [alltasks]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const Alltype = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/v2/get_types",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        setAllType(Alltype.data.alltype);
        setAssignmentTypeNew(Alltype.data.alltype[0]?.assignmentType);
        // console.log(question);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  const updatetasks1 = async () => {
    setUpdate1(false);

    taskdata.visibility = Visibility;
    taskdata.assignmentQues = items;

    
    setAlltasks((prevData) => {
      const updatedData = [...prevData];
      updatedData[index1] = taskdata;
      return updatedData;
    });


    setUpdate(false);

    setTaskData({
      assignmentTopic: "",
      assignmentType: "",
      startDate: "",
      lastDate: "",
    });
    setItems([]);
    setVisibility(false);
  };

  const updatetask2 = async () => {
    try {
      setUpdate(false);

      if (
        !taskdata.assignmentTopic ||
        !taskdata.assignmentType ||
        !taskdata.startDate ||
        !taskdata.lastDate
      ) {
        return toast.error("Fill All the Deatils");
      }

      taskdata.visibility = Visibility;
      taskdata.assignmentQues = items;

      setTasks((prevData) => {
        const updatedData = [...prevData];
        updatedData[index1] = taskdata;
        return updatedData;
      });

      setUpdate1(false);

      const Result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + `/api/v2/update_task/${id}`,
        {
          taskdata,
          taskId: tasks[index1]._id,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (Result.data.success) {
        const { alltasks, attachlinks, assignmentfileUrl } =
          Result.data.updatedAssignment;

        setTasks(alltasks);
        setAttachlinks(attachlinks);
        setassignmentfileUrl(assignmentfileUrl);
      }

      setTaskData({
        assignmentTopic: "",
        assignmentType: "",
        startDate: "",
        lastDate: "",
      });
      setVisibility(false);
      setItems([]);

      console.log(Result);
      toast.success("Task Updated Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const Addtasks = (e) => {
    e.preventDefault();

    if (!assignmentTopic || !lastDate || !startDate || !assignmentType) {
      toast.error("Please fill all fields");
    } else {
      // Create a new task object with the provided data
      const newTask = {
        assignmentTopic: assignmentTopic,
        lastDate: lastDate,
        assignmentQues: items,
        visibility: Visibility,
        assignmentType: assignmentType,
        startDate: startDate,
      };

      console.log(newTask);

      // Update the state with the new task
      setAlltasks((prevData) => [...prevData, newTask]);

      // Reset the form or clear relevant state variables if needed
      setTaskData({
        assignmentTopic: "",
        assignmentType: "Letter Writing",
        lastDate: "",
        startDate: "",
      });
      setItems([]);
      setVisibility(false);
      toast.success("Task added successfully");
    }
  };

  const updatetask = (index, allassignment, isupdate) => {
    console.log("taskk data", allassignment);

    setUpdate1(false);
    setUpdate(false);

    if (isupdate) {
      setUpdate1(true);
    } else {
      setUpdate(true);
    }

    setIndex1(index);

    // console.log(allassignment.visibility)
    setVisibility(allassignment.visibility);

    setTaskData({
      assignmentTopic: allassignment.assignmentTopic,
      assignmentType: allassignment.assignmentType,
      lastDate: allassignment.lastDate,
      startDate: allassignment.startDate,
    });
    setItems(allassignment.assignmentQues);
  };

  function deletehandle1(index) {
    const updated = assignmentfileUrl.filter((file, i) => i !== index);
    setassignmentfileUrl(updated);
  }
  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  const submithandler = async (event) => {
    event.preventDefault();

    console.log(file);

    console.log(alltasks);

    const formDataToSend = new FormData();

    if (assignmentfileUrl.length > 0) {
      const finalUrls = assignmentfileUrl.map((url) => {
        const { filename, fileurl } = url;
        return { filename, fileurl };
      });

      // console.log("final url", finalUrls);

      finalUrls.forEach((item, index) => {
        for (let key in item) {
          formDataToSend.append(`finalUrls[${index}][${key}]`, item[key]);
        }
      });
    }

    if (file && file.length > 0) {
      file &&
        file.forEach((f) => {
          formDataToSend.append("file", f[0]);
        });
    }

    formDataToSend.append("attachlinks", JSON.stringify(attachlinks));

    formDataToSend.append("alltasks", JSON.stringify(alltasks));

    formDataToSend.append("tasks", JSON.stringify(tasks));

    try {
      setLoading(true);

      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + `/api/v2/add_task/${id}`,
        formDataToSend,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      // console.log(result);
      if (!result.data.success) {
        throw new Error(result.data.message);
      }

      setLoading(false);
      toast.success("Submitted Successfully");

      // Reset the 'File' property to an empty array

      const updatedSubmissionResult = await apiConnector(
        "GET",
        process.env.REACT_APP_BASE_URL + `/api/v2/assignment/${id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      setFiles([]);
      setAlltasks([]);
      setTasks([]);

      // setUpdateDialogOpen1(false)

      // setDeleteDialogOpen(false)

      if (updatedSubmissionResult.data.assignment) {
        const { alltasks, attachlinks, assignmentfileUrl } =
          updatedSubmissionResult.data.assignment;

        setAlltasks(alltasks);
        setAttachlinks(attachlinks);
        setassignmentfileUrl(assignmentfileUrl);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed To Update Assignment"
      );

      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        // console.log(id);
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + `/api/v2/assignment/${id}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log(response.data.assignment);

        if (response.data.assignment) {
          const { alltasks, attachlinks, assignmentfileUrl, startDate } =
            response.data.assignment;

          setMinDate(startDate);
          setTasks(alltasks);
          setAttachlinks(attachlinks);
          setassignmentfileUrl(assignmentfileUrl);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleRemoveItem = (indexToRemove) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] sm:signinbg">
          <div class="spinner"></div>
        </div>
      ) : (
        <>
          <div className=" h-full min-h-screen mb-16">
            <div className="bg-richblue-600 h-full text-richblue-10 p-10">
              <div className="flex text-2xl gap-10 font-semibold items-center max-w-4xl">
                <div
                  className="hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20"
                  onClick={goBack}
                >
                  <BiArrowBack />
                </div>

                <div>
                  <span className="font-normal">Add Tasks - {name}</span>
                </div>
              </div>
            </div>

            <div className="max-w-[80%] sm:max-w-4xl mx-auto text-richblue-900 mt-10">
              <div className="mt-12">
                <label
                  htmlFor="country"
                  className="block  leading-6 font-medium mb-4"
                >
                  Add Task
                </label>

                <div className=" flex justify-center items-center w-full bg-richblue-10">
                  <div className="p-8 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <div>
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="assignmentName"
                          className="block leading-6 font-medium"
                        >
                          Task Name
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="assignmentTopic"
                              value={assignmentTopic}
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="Task Name"
                              onChange={changehandler2}
                            />
                          </div>
                        </div>
                      </div>
                      <label
                        htmlFor="country"
                        className="block mt-4 font-medium leading-6  "
                      >
                        Add Task Topic
                      </label>
                      <div className="mt-2 ">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <Input
                            type="text"
                            placeholder="Add Task Topic"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>

                        {inputValue.trim() && (
                          <Button
                            onClick={handleAddItem}
                            className="mt-2"
                            size="sm"
                            type="button"
                          >
                            Add
                          </Button>
                        )}

                        {items.length > 0 && (
                          <div className=" mt-2">
                            <ol className="space-y-2">
                              {items.map((item, index) => (
                                <li
                                  key={index}
                                  className="flex items-center justify-between bg-gray-100 pl-4 rounded"
                                >
                                  <span className="flex-grow font-medium">
                                    {item}
                                  </span>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleRemoveItem(index)}
                                    //   className="hover:bg-red-100"
                                  >
                                    <X className="h-4 w-4 " />
                                  </Button>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>

                      <label
                        htmlFor="country"
                        className="block mt-4 font-medium leading-6  "
                      >
                        Task Type
                      </label>
                      <div className="mt-2">
                        <select
                          name="assignmentType"
                          autoComplete="assignmentName"
                          value={assignmentType}
                          onChange={changehandler2}
                          className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option selected disabled>
                            Assignment-Type
                          </option>
                          {allType &&
                            allType.map((item, index) => (
                              <option key={index} value={item.assignmentType}>
                                {item.assignmentType}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex flex-col mt-4">
                        <label
                          htmlFor="AssignmentDate"
                          className=" text-richblue-900 mb-2 font-medium"
                        >
                          Set Start date
                        </label>
                        <input
                          type="date"
                          className="block w-[200px] rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={startDate}
                          name="startDate"
                          min={minDate || minDate1}
                          onChange={changehandler2}
                        />
                      </div>

                      <div className="flex flex-col mt-4">
                        <label
                          htmlFor="AssignmentDate"
                          className=" text-richblue-900 mb-2 font-medium"
                        >
                          Set Due date
                        </label>
                        <input
                          type="date"
                          className="block w-[200px] rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={lastDate}
                          name="lastDate"
                          min={startDate}
                          onChange={changehandler2}
                        />
                      </div>
                      <div className="flex items-center space-x-2  my-4">
                        <Checkbox
                          id="terms"
                          checked={Visibility}
                          onCheckedChange={() => {
                            setVisibility(!Visibility);
                          }}
                        />
                        <label
                          htmlFor="terms"
                          className=" font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Set Visibility
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {update || update1 ? (
                  <Button
                    className={cn("mt-2")}
                    onClick={(e) => {
                      e.preventDefault();

                      if (update1) {
                        setUpdateDialogOpen(true);
                      } else {
                        updatetasks1();
                      }
                    }}
                  >
                    Update
                  </Button>
                ) : (
                  <Button className={cn("mt-2")} onClick={Addtasks}>
                    Add Task
                  </Button>
                )}

                <AlertDialog
                  open={isUpdateDialogOpen}
                  onOpenChange={setUpdateDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="hidden">
                      Open Delete Dialog
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will update the task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="ghost">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button variant="default" onClick={updatetask2}>
                          Continue
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                  {alltasks.map((assignment, index) => (
                    <TaskCard
                      key={`all-${index}`}
                      assignment={assignment}
                      onTaskClick={() => updatetask(index, assignment, false)}
                      onDeleteTask={() => filtertasks(index)}
                      isAllTasks={false}
                    />
                  ))}

                  {tasks.map((assignment, index) => (
                    <TaskCard
                      key={`task-${index}`}
                      assignment={assignment}
                      onTaskClick={() => updatetask(index, assignment, true)}
                      onDeleteTask={() => filtertasks1(index)}
                      isAllTasks={true}
                    />
                  ))}
                </div>
              </div>

              <div className="pb-12">
                <div className="mt-12">
                  <input
                    id="file-upload"
                    accept=".pdf"
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
                    <label
                      htmlFor=" Assignment File"
                      className="block font-medium leading-6 "
                    >
                      Task Files
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[#4477CE] px-6 py-10  bg-richblue-100">
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
                </div>

                {file.map((file, index) => {
                  return (
                    <div>
                      <div
                        key={index}
                        className="text-richlue-900 bg-richblue-10 m-2 p-[4px] rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                      >
                        <div className="text-richblue-900 font-semibold text-sm">
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

                {assignmentfileUrl &&
                  assignmentfileUrl.map((file, index) => {
                    return (
                      <div>
                        <div
                          key={index}
                          className="text-richlue-900 bg-richblue-10 m-2 p-[4px] rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                        >
                          <Link to={file.fileurl} target="_blank">
                            <div
                              className="text-richblue-900 font-semibold hover:underline text-sm"
                              target="blank"
                            >
                              <p>
                                {index + 1}. {file.filename}
                              </p>
                            </div>
                          </Link>
                          <div
                            className="mr-4 text-lg cursor-pointer"
                            onClick={() => deletehandle1(index)}
                          >
                            <RxCross2 />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="attacklinks"
                  className="block leading-6 font-medium"
                >
                  Reference Links
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="linkurl"
                      value={linkurl}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Attach Reference Links"
                      onChange={handleLinkChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                {linkurl && (
                  <Button onClick={Addlinks} className={cn("mt-2")}>
                    Add Link
                  </Button>
                )}

                {attachlinks.map((links, index) => (
                  <div
                    key={index}
                    className="text-richblue-900 bg-richblue-10 m-2 p-[4px] rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                  >
                    <Link
                      to={links.linkurl}
                      target="_blank"
                      className="max-w-[90%]"
                    >
                      <p className="hover:underline text-richblue-300 text-sm max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap">
                        {links.linkurl}
                      </p>
                    </Link>

                    <div
                      className="mr-4 text-lg cursor-pointer"
                      onClick={() => filterlinks(index)}
                    >
                      <RxCross2 />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="btn"
                className={cn("mt-12")}
                onClick={submithandler}
              >
                Submit
              </Button>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

export default Alltasks;

export const TaskCard = ({
  assignment,
  onTaskClick ,
  onDeleteTask,
  isAllTasks = false,
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className={`
        w-full 
        hover:shadow-lg 
        transition-all 
        duration-300 
        ${
          assignment.visibility
            ? "border-l-4 border-l-purple-500"
            : "border-l-4 border-l-green-600"
        }
        hover:scale-[1.02]
      `}
      onClick={onTaskClick}
    >
      <CardContent className="p-4 grid grid-cols-12 gap-4">
        {/* Task Details */}
        <div className="col-span-9 space-y-3">
          {/* Task Name */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Task Name:</span>
            <Badge variant="secondary">
              {assignment.assignmentTopic.toUpperCase()}
            </Badge>
          </div>

          {/* Task Topics */}
          {assignment?.assignmentQues?.length > 0 && (
            <div>
              <span className="font-semibold text-sm block mb-1">
                Task Topics:
              </span>
              <ul className="space-y-1">
                {assignment.assignmentQues.map((topic, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded px-2 py-1 text-xs"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Schedule */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Schedule:</span>
            <Badge variant="outline">
              {formatDate(assignment.startDate)} -{" "}
              {formatDate(assignment.lastDate)}
            </Badge>
          </div>

          {/* Task Type and Visibility */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">Task Type:</span>
              <Badge variant="secondary">{assignment.assignmentType}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">Visible:</span>
              <Badge
                variant={assignment.visibility ? "default" : "destructive"}
              >
                {assignment.visibility ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <div className="col-span-1 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask();
            }}
          >
            <X className="h-5 w-5 text-gray-500 hover:text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
