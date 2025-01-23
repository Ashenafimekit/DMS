import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Modal, Form, message } from "antd";

const { Search } = Input;
const { Option } = Select;

const OrganizationList = () => {
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
      //console.log("organizationDataList:", organizationDataList);

      const transformedData = organizationDataList.map(
        (organization, index) => ({
          key: index + 1,
          id: organization._id,
          organizationName: organization.organizationName,
          organizationType: organization.organizationType,
          numberOfMembers: organization.numberOfMembers,
          email: organization.email,
          phone: organization.phone,
          city: organization.city,
          country: organization.country,
          dateOfEstablishment: new Date(
            organization.dateOfEstablishment
          ).toLocaleDateString(),
          status: organization.status,
          director: `${organization.director.name} ${organization.director.fatherName} ${organization.director.grandfatherName}`,
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

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/company/delete-company/${record.id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        message.success("Record deleted successfully!");
      }

      setOrganizationList((prev) =>
        prev.filter((item) => item.id !== record.id)
      );
      setFilteredData((prev) => prev.filter((item) => item.id !== record.id));
    } catch (error) {
      console.error("Error deleting record: ", error);
      message.error("Failed to delete record.");
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue(record); // Reset form fields with the selected record's data
  };

  const handleSaveEdit = async (values) => {
    try {
      const response = await axios.put(
        `${apiUrl}/company/edit-company/${editingRecord.id}`,
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
      message.error("Failed to update record.");
    }
  };

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "organizationName",
      key: "organizationName",
      sorter: (a, b) => a.organizationName.localeCompare(b.organizationName),
    },
    {
      title: "Organization Type",
      dataIndex: "organizationType",
      key: "organizationType",
      sorter: (a, b) => a.organizationType.localeCompare(b.organizationType),
    },
    {
      title: "Number of Members",
      dataIndex: "numberOfMembers",
      key: "numberOfMembers",
      sorter: (a, b) => a.numberOfMembers.localeCompare(b.numberOfMembers),
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
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Date of Establishment",
      dataIndex: "dateOfEstablishment",
      key: "dateOfEstablishment",
      sorter: (a, b) =>
        new Date(a.dateOfEstablishment).getTime() -
        new Date(b.dateOfEstablishment).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
      sorter: (a, b) => a.director.localeCompare(b.director),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="w-full flex flex-row gap-2">
          <Button
            type=""
            className="bg-yellow-500"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type=""
            className="bg-red-500"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full overflow-auto ">
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
      <div className="flex items-center justify-center w-full ">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="Edit Organization"
        open={isEditing}
        onCancel={() => {
          setIsEditing(false);
          setEditingRecord(null);
        }}
        footer={null}
        afterClose={() => form.resetFields()}
      >
        <Form form={form} onFinish={handleSaveEdit} layout="vertical">
          <Form.Item
            name="organizationName"
            label="Organization Name"
            rules={[
              { required: true, message: "Please enter organization name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="organizationType"
            label="Organization Type"
            rules={[
              { required: true, message: "Please enter organization type" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="numberOfMembers"
            label="Number of Members"
            rules={[
              { required: true, message: "Please enter number of members" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
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
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please enter country" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Select placeholder="Select status" size="large">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
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

export default OrganizationList;
