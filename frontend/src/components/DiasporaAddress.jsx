import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form, message } from "antd";
import { ToastContainer, toast } from "react-toastify";
const { Search } = Input;

const DiasporaAddress = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [addressList, setAddressList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/diaspora/diaspora-address`, {
        withCredentials: true,
      });
      //console.log("Address : ", response.data.address);
      //console.log("list : ", response.data.diaspora);

      const diasporaMap = response.data.diaspora.reduce((map, diaspora) => {
        map[diaspora._id] =
          diaspora.firstName +
          " " +
          diaspora.middleName +
          " " +
          diaspora.lastName;
        return map;
      }, {});

      const addressData = response.data.address;

      const transformedData = addressData.map((address, index) => ({
        key: index + 1,
        id: address._id,
        diasporaName: diasporaMap[address.diasporaID],
        region: address.region,
        zone: address.zone,
        city: address.city,
        subcity: address.subcity,
        district: address.district,
        kebele: address.kebele,
        houseNumber: address.houseNumber,
        phone: address.phone,
        mobile: address.mobile,
        email: address.email,
      }));

      setAddressList(transformedData);
      setFilteredData(transformedData);
      setLoading(false);
    } catch (error) {
      console.log("error : ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase();
    const filtered = addressList.filter((item) =>
      Object.values(item).some((val) =>
        val !== null && val !== undefined
          ? String(val).toLowerCase().includes(searchTerm)
          : false
      )
    );
    setFilteredData(filtered);
  };

  // Edit handlers
  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue(record);
  };

  const handleSaveEdit = async (values) => {
    try {
      const response = await axios.put(
        `${apiUrl}/diaspora/diaspora-address-edit/${editingRecord.id}`,
        values,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        message.success(response.data.message);
      }
      setAddressList((prev) =>
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
          message.error(errorMessage);
        } else if (status === 500) {
          message.error("Server error");
        } else {
          message.error(errorMessage);
        }
      }
    }
  };

  const columns = [
    {
      title: "Diaspora Name",
      dataIndex: "diasporaName",
      key: "diasporaName",
      sorter: (a, b) => a.diasporaName.localeCompare(b.diasporaName),
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      sorter: (a, b) => a.region.localeCompare(b.region),

    },
    {
      title: "Zone",
      dataIndex: "zone",
      key: "zone",
      sorter: (a, b) => a.zone.localeCompare(b.zone),

    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),

    },
    {
      title: "Subcity",
      dataIndex: "subcity",
      key: "subcity",
      sorter: (a, b) => a.subcity.localeCompare(b.subcity),

    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      sorter: (a, b) => a.district.localeCompare(b.district),

    },
    {
      title: "Kebele",
      dataIndex: "kebele",
      key: "kebele",
      sorter: (a, b) => a.kebele.localeCompare(b.kebele),

    },
    {
      title: "House Number",
      dataIndex: "houseNumber",
      key: "houseNumber",
      sorter: (a, b) => a.houseNumber.localeCompare(b.houseNumber),

    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),

    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      sorter: (a, b) => a.mobile.localeCompare(b.mobile),

    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),

    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="w-full">
          <Button
            type=""
            className="bg-yellow-400 w-full"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-5/6">
      <ToastContainer />
      <div className="flex flex-row gap-5 items-center justify-center w-1/2">
        <Search
          placeholder="Search diaspora data"
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button onClick={handleRefresh} type="primary">
          Refresh
        </Button>
      </div>
      <div className="flex items-center justify-center w-11/12">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
          //locale={{emptyText: "No data found"}}
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
        <Form form={form} onFinish={handleSaveEdit} layout="vertical">
          <Form.Item
            name="diasporaName"
            label="Diaspora Name"
            rules={[{ message: "Please enter Diaspora Name" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="region"
            label="Region"
            rules={[{ required: true, message: "Please enter Region" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="zone"
            label="Zone"
            rules={[{ message: "Please enter Zone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter City" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subcity"
            label="Subcity"
            rules={[{ message: "Please enter Subcity" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="district"
            label="District"
            rules={[{ message: "Please enter District" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="kebele"
            label="Kebele"
            rules={[{ message: "Please enter Kebele" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="houseNumber"
            label="House Number"
            rules={[{ message: "Please enter House Number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter Phone Number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { message: "Please enter Mobile Number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { message: "Please enter Email Address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
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

export default DiasporaAddress;
