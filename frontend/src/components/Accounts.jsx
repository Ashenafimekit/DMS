import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { ToastContainer, toast } from "react-toastify";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]); // State to store original data
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch user data from the API
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth/accounts`, {
        withCredentials: true,
      });
      const filteredUsers = response.data.users.filter(
        (user) => user.role !== "superadmin"
      );
      setUsers(filteredUsers);
      setOriginalUsers(filteredUsers); // Store the full data
      //console.log("accounts : ", filteredUsers);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        message.error("Session expired. Please log in again.");
        window.location.href = "/";
      }
      console.log("error ", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchUser();
      setLoading(false);
    }, 1000);
  };

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
        message.success(response.data.message);
      }

      setUsers(
        users.map((item) =>
          item._id === user._id ? { ...item, isApproved: true } : item
        )
      );
    } catch (error) {
      console.log("error : ", error);
      message.error("Server Error, please try again");
    }
  };

   // Delete handler
   const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/auth/delete-account/${record._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success(response.data.message);
      }

      setUsers((prev) => prev.filter((item) => item.id !== record.id));
    } catch (error) {
          console.error("Error deleting account: ", error);
    
          if (error.response) {
            const status = error.response.status;
            const errorMessage =
              error.response.data.message ;
    
            if (status === 404) {
              message.error(errorMessage);
            } else if (status === 500) {
              message.error("Server error");
            } else {
              message.error(errorMessage);
            }
          }
        }
  };

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase();
    if (searchTerm === "") {
      // Restore the full data when search term is cleared
      setUsers(originalUsers);
    } else {
      const filtered = originalUsers.filter((user) =>
        Object.values(user).some((val) =>
          val !== null && val !== undefined
            ? String(val).toLowerCase().includes(searchTerm)
            : false
        )
      );
      setUsers(filtered);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Approval",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) => (isApproved ? "Approved" : "Pending"),
    },
    {
      title: "Approve",
      key: "approve",
      render: (_, record) => (
        <div className="flex flex-row gap-1 w-full">
          <Button
            className="bg-green-500 text-white w-1/2"
            onClick={() => handleApprove(record)}
            disabled={record.isApproved}
          >
            {record.isApproved ? "Approved" : "Approve"}
          </Button>
          <Button
            type=""
            className="bg-red-500 w-1/2"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full items-center justify-center ">
      <div className="bg-gray-300 p-6">
        <h1>
          Manage user accounts by searching for users based on name, email, or
          role. You can clear the search box to restore the full list. To
          approve users, simply click the "Approve" button, and their status
          will be updated. Refresh the list to view the latest data.
        </h1>
      </div>
      <div className="flex flex-col gap-5 items-center justify-center w-full">
        <ToastContainer />
        <div className="flex flex-row gap-5 items-center justify-center w-1/2">
          <Input.Search
            placeholder="Search Account"
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Button onClick={handleRefresh} type="primary">
            Refresh
          </Button>
        </div>
        <div className="w-5/6">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={users}
            pagination={5}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Accounts;
