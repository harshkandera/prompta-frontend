import React from 'react'
import Navbar from "../user/Navbar"
import Footer from "../HomePage/Footer"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiConnector } from '../../service/apiconnector'
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Link } from 'react-router-dom'
import img17 from "../../assets/img17.png"
import { cn } from '../../lib/utils'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
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
} from "../../component/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../component/ui/table'


import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"



import { Button, buttonVariants } from "../../component/ui/button"

import { Checkbox } from "../../component/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal

} from "../../component/ui/dropdown-menu"

import { Badge } from '../../component/ui/badge'
import { Input } from "../../component/ui/input"



const AllUser = () => {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [isAuthorizeDialogOpen, setAuthorizeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [data, setData] = useState([])
  const [userData, setUserData] = useState([])
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
};

  useEffect(() => {
    const fetchdata = async () => {
      try {


        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_user_bysearch`, null, {
          Authorization: `Bearer ${token}`,
        });

        // console.log(response.data);
        setUserData(response.data.users)


      } catch (error) {


        console.log(error);
      }
    }

    fetchdata();

  }, []);





  const RoleChangeHandler = async (accountType) => {
    try {
      const selectedRowIdsArray = Array.from(selectedRowIds);

     setLoading(true)

      const result = await apiConnector("POST", process.env.REACT_APP_BASE_URL + "/api/v2/role_change",{ userIds: selectedRowIdsArray ,
      accountType
      },  {
        Authorization: `Bearer ${token}`,
      })

      // console.log(result)
      toast.success("Role Changed successfully")
      setLoading(false)



      

      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + '/api/v2/get_user_bysearch', null, {
        Authorization: `Bearer ${token}`,
      });


      if (response.data.success) {
        setUserData(response.data.users)
      }

    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to change role");

      console.log(error)
    }

  }



  const deleteUser = async () => {
    try {
      const selectedRowIdsArray = Array.from(selectedRowIds);
     setLoading(true)

      const result = await apiConnector("DELETE", process.env.REACT_APP_BASE_URL + "/api/v2/delete_user",{ userIds: selectedRowIdsArray },  {
        Authorization: `Bearer ${token}`,
      })

      // console.log(result)
      toast.success("User deleted successfully")
      setLoading(false)


      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + '/api/v2/get_user_bysearch', null, {
        Authorization: `Bearer ${token}`,
      });


      if (response.data.success) {
        setUserData(response.data.users)
      }

    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to delete user");

      console.log(error)
    }

  }





  useEffect(() => {
    setData([]);

    userData?.forEach((item) => {
      setData((prev) => [...prev, {

        id: item?._id,
        instituteName: item?.profile?.instituteName,
        role: item?.accountType,
        email: item?.email,
        name: `${item?.profile?.firstname} ${item?.profile?.lastname}`,
      }]);
    });
  }, [userData]);



  const handleRowSelectionChange = (id, isSelected) => {
    setSelectedRowIds(prevSelectedIds => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (isSelected) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });
  };







  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const allIds = table.getRowModel().rows.map(row => row.original.id);
              setSelectedRowIds(new Set(allIds));
            } else {
              setSelectedRowIds(new Set());
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleRowSelectionChange(row.original.id, value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>


      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        // <div className="capitalize">{row.getValue("verified")}</div>
        <Badge variant={row.getValue("role") === 'Student' ? 'default' : 'destructive'} size='sm' className={cn('capitalize h-6 text-xs font-medium')}>{row.getValue("role")}</Badge>

      ),
    },



    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },

    {
      accessorKey: "instituteName"
      ,
      header: () => 'Institute name',
      cell: ({ row }) => <div className="lowercase">{row.getValue("instituteName")}</div>,




    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const userId = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link to={`/adminpannel/submissions/${userId.id}/${userId?.name}`}> <DropdownMenuItem >View Submission</DropdownMenuItem></Link>

              <Link to={`/adminpannel/reports/${userId.id}/${userId?.name}`}> 
              <DropdownMenuItem >View Reports</DropdownMenuItem></Link>
              <DropdownMenuSeparator/>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => {
                                   setSelectedRowIds(new Set([userId?.id.toString()]));
                                  RoleChangeHandler('Admin')}}>
                                  Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() =>{ 
                                   setSelectedRowIds(new Set([userId?.id.toString()]));
                                  RoleChangeHandler('Expert')}}>
                                  Expert
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() =>{

                                   setSelectedRowIds(new Set([userId?.id.toString()]));

                                   if(selectedRowIds.size>0){
                                    RoleChangeHandler('Student')
                                   }
                                  }}>
                                  Student
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={
                () => {
                

                  setSelectedRowIds(new Set([userId?.id.toString()]));

                  setDeleteDialogOpen(true)
                }
              }>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })






  return (<div>


    <div className='z-0 min-h-screen'>
     

      <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
        <div className='flex text-2xl gap-10 font-semibold items-center cursor-pointer max-w-4xl'>
          <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20' onClick={goBack}>
            <BiArrowBack />
          </div>

          <div>
            <span className='font-normal'>All Users</span>
          </div>
        </div>




      </div>

      {
        loading ? (<div className='flex justify-center items-center h-[100vh] sm:signinbg'>
          <div class="spinner"></div>

        </div>) : (


          <div className='max-w-[90%] sm:max-w-4xl min-h-[100vh] mx-auto mt-8 mb-8 font-roboto'>

            <div>
              <div className=' mt-10 mb-10 ml-2 flex items-center gap-2 text-xl'>
                <h1 className='text-xl font-bold font-inter'>Users</h1>
                <div >
                  <img src={img17} alt="" className='w-10 h-10' />

                </div>        </div>



            </div>

            <div >

              <div className="w-full">
                <div className="flex items-center py-4">
                  <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />

                    {selectedRowIds.size > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            Actions <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setAuthorizeDialogOpen(true)}>
                            Authorize
                          </DropdownMenuItem>

                          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
                            Delete
                          </DropdownMenuItem>

                          <DropdownMenuSeparator/>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => {
                                
                                  RoleChangeHandler('Admin')}}>
                                  Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() =>{ 
                                 
                                  RoleChangeHandler('Expert')}}>
                                  Expert
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() =>{
                               
                                  RoleChangeHandler('Student')}}>
                                  Student
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}



                  <AlertDialog open={isAuthorizeDialogOpen} onOpenChange={setAuthorizeDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="hidden">Open Authorize Dialog</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will authorize the selected entries.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="ghost">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button variant="filled" >Continue</Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>


                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="hidden">Open Delete Dialog</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the selected entries.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="ghost">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button variant="filled" onClick={deleteUser}>Continue</Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Columns <ChevronDownIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          )
                        })}


                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Filter <ChevronDownIcon className=" h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>verified user</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>

                            <DropdownMenuItem onClick={() => {

                              (table.getColumn("role")?.setFilterValue('Admin'))


                            }}>Admin</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {

                              (table.getColumn("role")?.setFilterValue('Expert'))


                            }} >Expert</DropdownMenuItem>

                            <DropdownMenuItem onClick={() => {

                              (table.getColumn("role")?.setFilterValue('Student'))


                            }} >Student</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="rounded-md border">

                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup._id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header._id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                              </TableHead>
                            )
                          })}
                        </TableRow>

                      ))}
                    </TableHeader>


                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row._id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell._id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>


            </div>



          </div>
        )
      }

    </div>
    <Footer></Footer>

  </div>
  )
}

export default AllUser;





              // {isModalOpen && (
              //   <div
              //     className="z-50 fixed top-0 right-0 left-0  flex items-center justify-center  h-screen w-screen bg-black bg-opacity-50 blur-none"
        
              //     onClick={toggleModal}
              //   >
              //     <div className="fixed bg-richblue-10 w-50 max-w-md p-4 text-center rounded-lg shadow dark:bg-gray-800">
              //       <button
              //         onClick={toggleModal}
              //         className="absolute top-2.5 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              //       >
        
              //         <span className="sr-only">Close modal</span>
              //       </button>
        
              //       <p className="mb-4 text-gray-500 dark:text-gray-300">
              //         Are you sure you want to delete this User?
              //       </p>
              //       <div className="flex justify-center items-center space-x-4">
              //         <button
              //           onClick={toggleModal}
              //           className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              //         >
              //           No, cancel
              //         </button>
              //         <button
              //           onClick={deleteuserhandler}
              //           className="py-2 px-3 text-sm font-medium text-center text-richblue-10 bg-richblue-200 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
              //         >
              //           Yes, I'm sure
              //         </button>
              //       </div>
              //     </div>
              //   </div>
              // )}
        