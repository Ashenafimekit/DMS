import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/accounts`, {
          withCredentials: true,
        });
        const filteredUsers = response.data.users.filter(
          (user) => user.role !== "superadmin"
        );
        setUsers(filteredUsers);
        console.log("accounts : ", filteredUsers);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.message);
        }
        console.log("error ", error);
      }
    };

    fetchUser();
  }, []);

  const handleApprove = async (user) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/auth/approve/${user._id}`,
        {
          isApproved: true,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      }

      setUsers(
        users.map((item) =>
          item._id === user._id ? { ...item, isApproved: true } : item
        )
      );
    } catch (error) {
      console.log("error : ", error);
      toast.error("Server Error, please try again");
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "isApproved",
      headerName: "Approval",
      width: 150,
      renderCell: (params) => (params.row.isApproved ? "Approved" : "Pending"),
    },
    {
      field: "Approve",
      headerName: "Approve",
      width: 150,
      renderCell: (params) => (
        <button
          className="px-4 rounded-lg bg-secondary"
          onClick={() => handleApprove(params.row)}
          disabled={params.row.isApproved} // Disable the button if already approved
        >
          {params.row.isApproved ? "Approved" : "Approve"}
        </button>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-lightGray p-6">
        <h1 className="text-center">
          Welcome to the DMS Admin Dashboard! Manage your system
          effectively and ensure seamless travel experiences for your customers
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <ToastContainer />
        <div style={{ height: 495, width: "60%" }}>
          <DataGrid
            rows={users}
            getRowId={(row) => row._id}
            columns={columns}
            pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            // checkboxSelection
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "", // Dark background for header
                color: "white", // White text
              },
              ".MuiDataGrid-columnHeaderTitleContainer": {
                backgroundColor: "#1a1a1a",
                color: "white",
              },
              ".MuiDataGrid-columnHeader.MuiDataGrid-columnHeader--sortable.MuiDataGrid-withBorderColor":
                {
                  backgroundColor: "#1a1a1a",
                  color: "white",
                },
              ".MuiDataGrid-row--borderBottom.css-yrdy0g-MuiDataGrid-columnHeaderRow > .MuiDataGrid-filler":
                {
                  backgroundColor: "#1a1a1a",
                  color: "white",
                },
              "& .MuiDataGrid-sortIcon": {
                color: "white", // Sort arrow color
              },
              "& .MuiDataGrid-menuIconButton": {
                color: "white", // Default color for the three-dot menu
              },
              "& .MuiDataGrid-cell": {
                color: "#333", // Dark text color for rows
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#f7f7f7", // Light grey for odd rows
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#ffffff", // White for even rows
              },
              "& .MuiDataGrid-cell:hover": {
                backgroundColor: "#ddd", // Light grey on hover
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#1a1a1a", // Footer background
                color: "white !important", // Footer text color
              },
              "& .MuiTablePagination-displayedRows": {
                color: "white !important", // Text for displayed rows
              },
              "& .MuiTablePagination-selectLabel": {
                color: "white !important", // Text for "Rows per page"
              },
              "& .MuiSelect-select": {
                color: "white !important", // Dropdown text for page size
              },
              "& .MuiIconButton-root": {
                color: "white !important", // Pagination buttons
              },
              "& .MuiSelect-icon": {
                color: "white", // Dropdown arrow color
              },
              "& .MuiDataGrid-root": {
                border: "1px solid #ccc", // Light border around grid
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Accounts;
