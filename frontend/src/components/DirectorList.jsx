import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Modal, Form, message } from "antd";

const { Search } = Input;
const { Option } = Select;

const DirectorList = () => {
  const [organizationList, setOrganizationList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/company/get-company`, {
        withCredentials: true,
      });

      const organizationDataList = response.data.company;

      const transformedData = organizationDataList.map(
        (organization, index) => ({
          key: index + 1,
          id: organization._id,
          name: organization.director.name,
          fatherName: organization.director.fatherName,
          grandfatherName: organization.director.grandfatherName,
          contact: organization.director.contact,
          email: organization.director.email,
          phone: organization.director.phone,
          organizationName: organization.organizationName,
        })
      );

      setOrganizationList(transformedData);
      setFilteredData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchList();
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase();
    const filtered = organizationList.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
    setFilteredData(filtered);
  };

  
  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue(record); 
  };

  const handleSaveEdit = async (values) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/company/edit-director/${editingRecord.id}`,
        values,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
      }
      setOrganizationList((prev) =>
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
        if (error.response.status === 400) {
          message.error(error.response.data.message);
        }
        if (error.response.status === 404) {
          message.error(error.response.data.message);
        }
        if (error.response.status === 500) {
          message.error("Server error");
        }
        message.error("Failed to update record.");
      }
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Father Name",
      dataIndex: "fatherName",
      key: "fatherName",
      sorter: (a, b) => a.fatherName.localeCompare(b.fatherName),
    },
    {
      title: "Grandfather Name",
      dataIndex: "grandfatherName",
      key: "grandfatherName",
      sorter: (a, b) => a.grandfatherName.localeCompare(b.grandfatherName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Organization Name",
      dataIndex: "organizationName",
      key: "organizationName",
      sorter: (a, b) => a.organizationName.localeCompare(b.organizationName),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="w-full flex flex-row gap-2">
          <Button
            type=""
            className="bg-yellow-500 "
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full overflow-auto">
      <div className="flex flex-row gap-5 items-center justify-center w-1/2">
        <Search
          placeholder="Search organizations"
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button onClick={handleRefresh} type="primary">
          Refresh
        </Button>
      </div>
      <div className="flex items-center justify-center w-full">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Edit Director Information"
        open={isEditing}
        onCancel={() => {
          setIsEditing(false);
          setEditingRecord(null);
        }}
        footer={null}
        afterClose={() => form.resetFields()}
      >
        <Form
          form={form}
          onFinish={(values) => {
            // Structure the values to update director info properly
            const updatedData = {
              director: {
                name: values.name,
                fatherName: values.fatherName,
                grandfatherName: values.grandfatherName,
                contact: values.contact,
                email: values.email,
                phone: values.phone,
              },
              organizationName: values.organizationName,
            };
            handleSaveEdit(updatedData); // Pass updatedData to the save handler
          }}
          layout="vertical"
          initialValues={editingRecord} // Automatically populate with the selected record
        >
          <Form.Item
            name="name"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fatherName"
            label="Father Name"
            rules={[{ required: true, message: "Please enter father's name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grandfatherName"
            label="Grandfather Name"
            rules={[
              { required: true, message: "Please enter grandfather's name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact"
            rules={[
              { required: true, message: "Please enter contact information" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter a valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
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

export default DirectorList;
