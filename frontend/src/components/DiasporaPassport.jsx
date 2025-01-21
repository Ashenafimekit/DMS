import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Input, Select, DatePicker, Button, Modal, Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
const { Search } = Input;

const DiasporaPassport = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [passportList, setPassportList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/diaspora/diaspora-passport`, {
        withCredentials: true,
      });
      //console.log("passport : ", response.data.diasporaPassport);
      //console.log("list : ", response.data.diasporaList);

      const diasporaMap = response.data.diasporaList.reduce((map, diaspora) => {
        map[diaspora._id] =
          diaspora.firstName +
          " " +
          diaspora.middleName +
          " " +
          diaspora.lastName;
        return map;
      }, {});

      const passportData = response.data.diasporaPassport;

      const transformedData = passportData.map((passport, index) => ({
        key: index + 1,
        id: passport._id,
        diasporaName: diasporaMap[passport.diasporaID],
        passportNo: passport.passportNo,
        issueAuthority: passport.issueAuthority,
        issueDate: new Date(passport.issueDate).toLocaleDateString(),
        issuePlace: passport.issuePlace,
        expiryDate: new Date(passport.expiryDate).toLocaleDateString(),
      }));

      setPassportList(transformedData);
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
    const filtered = passportList.filter((item) =>
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
        `${apiUrl}/diaspora/diaspora-passport-edit/${editingRecord.id}`,
        values,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      setPassportList((prev) =>
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
      title: "Diaspora Name",
      dataIndex: "diasporaName",
      key: "diasporaName",
      sorter: (a, b) => a.diasporaName.localeCompare(b.diasporaName),
    },
    {
      title: "Passport No",
      dataIndex: "passportNo",
      key: "passportNo",
      sorter: (a, b) => a.passportNo.localeCompare(b.passportNo),

    },
    {
      title: "Issue Authority",
      dataIndex: "issueAuthority",
      key: "issueAuthority",
      sorter: (a, b) => a.issueAuthority.localeCompare(b.issueAuthority),
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) =>
        new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
    },
    {
      title: "Issue Place",
      dataIndex: "issuePlace",
      key: "issuePlace",
      sorter: (a, b) => a.issuePlace.localeCompare(b.issuePlace),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
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
      <div className="flex items-center justify-center ">
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
            name="passportNo"
            label="Passport Number"
            rules={[
              { required: true, message: "Please enter Passport Number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="issueAuthority"
            label="Issue Authority"
            rules={[
              { required: true, message: "Please enter Issue Authority" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="issueDate"
            label="Issue Date"
            rules={[{ required: true, message: "Please enter Issue Date" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="issuePlace"
            label="Issue Place"
            rules={[{ required: true, message: "Please enter Issue place" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="Expiry Date"
            rules={[{ required: true, message: "Please enter expiry Date" }]}
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

export default DiasporaPassport;
