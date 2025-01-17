import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Modal, Form, message } from "antd";
import { ToastContainer, toast } from "react-toastify";

const { Search } = Input;

const DiasporaList = () => {
  const [diasporaList, setDiasporaList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm(); // Initialize Ant Design form instance
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/diaspora/diaspora-list`, {
          withCredentials: true,
        });
        console.log("list : ", response.data.diasporaList);
        const profileDataList = response.data.diasporaList;

        const transformedData = profileDataList.map((profile, index) => ({
          key: index + 1,
          id: profile._id, // Assuming there's a unique ID from the backend
          firstName: profile.firstName,
          middleName: profile.middleName,
          lastName: profile.lastName,
          birthDate: new Date(profile.birthDate).toLocaleDateString(),
          formerNationality: profile.formerNationality,
          presentNationality: profile.presentNationality,
          maritalStatus: profile.marriedStatus,
          religion: profile.religion,
          photo: profile.photo ? "Available" : "Not Available",
        }));

        setDiasporaList(transformedData);
        setFilteredData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase();
    const filtered = diasporaList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
    setFilteredData(filtered);
  };

  // Delete handler
  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/diaspora/diaspora-delete/${record.id}`,
        {
          withCredentials: true,
        }
      );

      if(response.status === 201){
        toast.success("Record deleted successfully!");

      }

      setDiasporaList((prev) => prev.filter((item) => item.id !== record.id));
      setFilteredData((prev) => prev.filter((item) => item.id !== record.id));
    } catch (error) {
      console.error("Error deleting record: ", error);
      toast.error("Failed to delete record.");
    }
  };

  // Edit handlers
  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue(record); // Reset form fields with the selected record's data
  };

  const handleSaveEdit = async (values) => {
    try {
      const response = await axios.put(
        `${apiUrl}/diaspora/diaspora-info-edit/${editingRecord.id}`,
        values,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      setDiasporaList((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        )
      );
      setFilteredData((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        )
      );
      setIsEditing(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Error updating record: ", error);

      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data.message || "Failed to update record.";

        if (status === 404) {
          toast.error(errorMessage);
        } else if (status === 500) {
          toast.error("Server error");
        } else {
          toast.error(errorMessage);
        }
      }
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Middle Name",
      dataIndex: "middleName",
      key: "middleName",
      sorter: (a, b) => a.middleName.localeCompare(b.middleName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Birth Date",
      dataIndex: "birthDate",
      key: "birthDate",
      sorter: (a, b) =>
        new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime(),
    },
    {
      title: "Former Nationality",
      dataIndex: "formerNationality",
      key: "formerNationality",
    },
    {
      title: "Present Nationality",
      dataIndex: "presentNationality",
      key: "presentNationality",
    },
    {
      title: "Marial Status",
      dataIndex: "maritalStatus",
      key: "maritalStatus",
    },
    {
      title: "Religion",
      dataIndex: "religion",
      key: "religion",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="w-full">
          <Button
            type=""
            className="bg-yellow-400 w-1/2"
            onClick={() => handleEdit(record)}
          >
            Edit
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
    <div className="flex flex-col gap-2 items-center justify-center w-5/6">
      <ToastContainer />
      <div className="flex items-center justify-center w-1/2">
        <Search
          placeholder="Search diaspora data"
          onSearch={handleSearch}
          enterButton
        />
      </div>
      <div className="flex items-center justify-center pl-10">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Edit Diaspora Record"
        open={isEditing}
        onCancel={() => {
          setIsEditing(false);
          setEditingRecord(null);
        }}
        footer={null}
        afterClose={() => form.resetFields()}
      >
        <Form
          form={form} // Connect the form instance
          onFinish={handleSaveEdit}
          layout="vertical"
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="middleName"
            label="Middle Name"
            rules={[{ message: "Please enter middle name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthDate"
            label="Birthdate"
            rules={[{ required: true, message: "Please enter birthdate" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="formerNationality"
            label="Former Nationality"
            rules={[{ message: "Please enter Former Natinality" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="presentNationality"
            label="Present Nationality"
            rules={[{ message: "Please enter Present Nationality" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maritalStatus"
            label="Martial Status"
            rules={[{ message: "Please enter Martial status" }]}
          >
            <Select placeholder="Select marital status">
              <Option value="single">Single</Option>
              <Option value="married">Married</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="religion"
            label="Religion"
            rules={[{ message: "Please enter Religion" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiasporaList;
