import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiConnector } from "../../service/apiconnector";
import { useSelector } from "react-redux";
import img22 from "../../assets/img22.png";
import img12 from "../../assets/img12.jpg";
import Img24 from "../../assets/img24.png";
import toast from "react-hot-toast";
import axios from "axios";
import { cn } from "../../lib/utils";
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
} from "@tanstack/react-table";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../component/ui/table";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import { Button } from "../../component/ui/button";

import { Checkbox } from "../../component/ui/checkbox";
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
  DropdownMenuPortal,
} from "../../component/ui/dropdown-menu";

import { Badge } from "../../component/ui/badge";
import { Input } from "../../component/ui/input";

import Footer from "../HomePage/Footer";

const ViewSubmission = () => {
  const navigate = useNavigate();

  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const { id, name } = useParams();
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [assignmentData, setAssignmentData] = useState({});
  const [inputfield, setInputField] = useState("");

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);

        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + `/api/v2/get_allsubmission/${id}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log(response.data);
        setUserData(response.data.Allsubmission);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };

    fetchdata();
  }, []);

  const deleteUser = async () => {
    try {
      setLoading(true);
      const selectedRowIdsArray = Array.from(selectedRowIds);

      const result = await apiConnector(
        "DELETE",
        process.env.REACT_APP_BASE_URL + `/api/v2/delete_user_submission/${id}`,
        { userIds: selectedRowIdsArray },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (result.data.success) {
        setUserData(result.data.Allsubmission);
      }

      setLoading(false);
      toast.success("Delete Successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Delete");
      console.error("An error occurred:", error);
    }
  };

  const handleAuthorizeAction = async () => {
    try {
      setLoading(true);
      const selectedRowIdsArray = Array.from(selectedRowIds);

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/v2/verify_user_submission/${id}`,
        { userIds: selectedRowIdsArray, verified: true },
        { Authorization: `Bearer ${token}` }
      );
      

      setUserData(result.data.Allsubmission);

      console.log(result);
      setLoading(false);
      toast.success("Verified Successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Verify");
      console.error("An error occurred:", error);
    }
  };

  const handleUnauthorizeAction = async () => {
    try {
      setLoading(true);
      const selectedRowIdsArray = Array.from(selectedRowIds);

      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/v2/verify_user_submission/${id}`,
        { userIds: selectedRowIdsArray, verified: false },
        { Authorization: `Bearer ${token}` }
      );
      

      setUserData(result.data.Allsubmission);

      console.log(result);
      setLoading(false);
      toast.success("Unverified Successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Unverify");
      console.error("An error occurred:", error);
    }
  };

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
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

        setAssignmentData(response.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL +
            `/api/v2/get_user_bybranch/${inputfield}/${id}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // console.log(response.data.users);
        setUserData(response.data.users);
        // console.log(alluser)
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };

    fetchdata();
  }, [inputfield]);

  useEffect(() => {
    setData([]);

    userData?.forEach((item) => {
      setData((prev) => [
        ...prev,
        {
          id: item?._id,
          userId: item.userId?._id,
          email: item.userId?.email,
          name: `${item?.userId?.profile.firstname} ${item?.userId?.profile.lastname}`,
          verified: item?.verified,
          group: item?.group,
        },
      ]);
    });
  }, [userData]);

  const handleRowSelectionChange = (id, isSelected) => {
    setSelectedRowIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (isSelected) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });
  };

  function intToAlphabet(num) {
    if (num >= 1 && num <= 26) {
      return String.fromCharCode(num + 64); // 65 corresponds to 'A', 66 to 'B', and so on
    } else {
      return null; // Return null for numbers outside the valid range
    }
  }

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
              const allIds = table
                .getRowModel()
                .rows.map((row) => row.original.userId);
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
            handleRowSelectionChange(row.original.userId, value);
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
      accessorKey: "verified",
      header: "Verfied",
      cell: ({ row }) => (
        // <div className="capitalize">{row.getValue("verified")}</div>
        <Badge
          variant={row.getValue("verified") ? "default" : "destructive"}
          size="sm"
          className={cn("h-6 text-xs font-medium")}
        >
          {row.getValue("verified") ? "Active" : "Requested"}
        </Badge>
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
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },

    {
      accessorKey: "group",
      header: () => "Group",
      cell: ({ row }) => {
        const num = row.getValue("group");
        return intToAlphabet(num);
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userId = row.original;

        return (
          <div className="flex gap-2">
            {row.getValue("verified") ? (
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  setSelectedRowIds(new Set([userId?.userId.toString()]));
                  setUnauthoriseDialogOpen(true);
                }}
              >
                Unauthorize
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedRowIds(new Set([userId?.userId.toString()]));
                  setAuthorizeDialogOpen(true);
                }}
              >
                Authorize
              </Button>
            )}
          </div>
        );
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const userId = row.original;

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
              <Link
                to={`/adminpannel/all_submission/${userId?.userId}/${id}/${userId?.name}`}
              >
                {" "}
                <DropdownMenuItem>View Submission</DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedRowIds(new Set([userId?.userId.toString()]));
                  setAuthorizeDialogOpen(true);
                }}
              >
                Authorize
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRowIds(new Set([userId?.userId.toString()]));
                  setDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

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
  });

  const [isAuthorizeDialogOpen, setAuthorizeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUnauthoriseDialogOpen, setUnauthoriseDialogOpen] = useState(false);

  return (
    <div>
      <div className="min-h-[100vh] font-roboto ">
        <div className="bg-richblue-600 h-full text-richblue-10 p-10">
          <div className="flex text-2xl gap-10 font-semibold items-center max-w-4xl">
            <div
              className="hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20  cursor-pointer"
              onClick={goBack}
            >
              <BiArrowBack />
            </div>

            <div>
              {name} - <span className="text-lg">View Submission</span>
            </div>
          </div>
        </div>

        <div className="font-roboto max-w-[90%] sm:max-w-4xl mx-auto text-richblue-900 mt-4">
          <div>
            <div className="w-20 h-20">
              <img src={img22} alt="" />
            </div>
            <div className="text-xl font-semibold">Submissions</div>
          </div>

          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter emails..."
                value={table.getColumn("email")?.getFilterValue() ?? ""}
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
                    <DropdownMenuItem
                      onSelect={() => setAuthorizeDialogOpen(true)}
                    >
                      Authorize
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <AlertDialog
                open={isAuthorizeDialogOpen}
                onOpenChange={setAuthorizeDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="hidden">
                    Open Authorize Dialog
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will authorize the
                      selected entries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="ghost">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button variant="filled" onClick={handleAuthorizeAction}>
                        Continue
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog
                open={isUnauthoriseDialogOpen}
                onOpenChange={setUnauthoriseDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="hidden">
                    Open Unauthorize Dialog
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will unauthorize the
                      selected entries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="ghost">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="filled"
                        onClick={handleUnauthorizeAction}
                      >
                        Continue
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
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
                      This action cannot be undone. This will permanently delete
                      the selected entries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="ghost">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button variant="filled" onClick={deleteUser}>
                        Continue
                      </Button>
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
                      );
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
                    <DropdownMenuSubTrigger>
                      verified user
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => {
                            table.getColumn("verified")?.setFilterValue(false);
                          }}
                        >
                          Requested
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            table.getColumn("verified")?.setFilterValue(true);
                          }}
                        >
                          Active
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Groups</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {assignmentData &&
                          assignmentData.groups &&
                          Array.from(
                            { length: assignmentData.groups },
                            (_, index) => (
                              <DropdownMenuItem
                                key={index}
                                onSelect={() => setInputField(index + 1)}
                              >
                                {" "}
                                {intToAlphabet(index + 1)}
                              </DropdownMenuItem>
                            )
                          )}
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
                        );
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
      <Footer></Footer>
    </div>
  );
};

export default ViewSubmission;
