import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { Search } = Input;

const DiasporaRelative = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRelative, setEditingRelative] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/diaspora/diaspora-relative`, {
        withCredentials: true,
      });

      const diasporaList = response.data.diaspora;
      const relativeList = response.data.diasporaRelative;

      //console.log("Relatives:", relativeList);

      const rows = [];
      diasporaList.forEach((diaspora) => {
        const relatives = relativeList.filter(
          (relative) => relative.diasporaID === diaspora._id
        );

        if (relatives.length > 0) {
          relatives.forEach((relative, index) => {
            rows.push({
              key: `${diaspora._id}-${index}`,
              diasporaName: `${diaspora.firstName} ${diaspora.middleName} ${diaspora.lastName}`,
              showDiasporaName: index === 0,
              relationType: relative.relationType || "N/A",
              firstName: relative.firstName || "N/A",
              middleName: relative.middleName || "N/A",
              lastName: relative.lastName || "N/A",
              email: relative.email || "N/A",
              region: relative.region || "N/A",
              zone: relative.zone || "N/A",
              district: relative.district || "N/A",
              houseNumbers: relative.houseNumbers || "N/A",
              sex: relative.sex || "N/A",
              nationality: relative.nationality || "N/A",
              city: relative.city || "N/A",
              relativeId: relative._id,
            });
          });
        } else {
          rows.push({
            key: `${diaspora._id}-no-relative`,
            diasporaName: `${diaspora.firstName} ${diaspora.middleName} ${diaspora.lastName}`,
            showDiasporaName: true,
            relationType: "No Relatives Found",
            firstName: "N/A",
            middleName: "N/A",
            lastName: "N/A",
            email: "N/A",
            region: "N/A",
            zone: "N/A",
            district: "N/A",
            houseNumbers: "N/A",
            sex: "N/A",
            nationality: "N/A",
            city: "N/A",
          });
        }
      });

      setData(rows);
      setFilteredData(rows);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        val !== null && val !== undefined
          ? String(val).toLowerCase().includes(searchTerm)
          : false
      )
    );
    setFilteredData(filtered);
  };

  const handleEdit = (relative) => {
    setEditingRelative(relative);
    form.setFieldsValue(relative);
    setIsEditing(true);
  };

  const handleDelete = async (relativeId) => {
    try {
      await axios.delete(`${apiUrl}/diaspora/relative-delete/${relativeId}`, {
        withCredentials: true,
      });
      message.success("Relative deleted successfully!");
      fetchData();
    } catch (error) {
      message.error("Failed to delete relative.");
      console.error(error);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(
        `${apiUrl}/diaspora/diaspora-relative-edit/${editingRelative.relativeId}`,
        values,
        {
          withCredentials: true,
        }
      );
      message.success("Relative updated successfully!");
      setIsEditing(false);
      setEditingRelative(null);
      fetchData();
    } catch (error) {
      message.error("Failed to update relative.");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Diaspora Name",
      dataIndex: "diasporaName",
      key: "diasporaName",
      render: (value, row, index) => {
        const rowSpan = data.filter(
          (item) => item.diasporaName === row.diasporaName
        ).length;

        return row.showDiasporaName
          ? {
              children: value,
              props: { rowSpan },
            }
          : {
              children: null,
              props: { rowSpan: 0 },
            };
      },
    },
    {
      title: "Relation Type",
      dataIndex: "relationType",
      key: "relationType",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Middle Name",
      dataIndex: "middleName",
      key: "middleName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Zone",
      dataIndex: "zone",
      key: "zone",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "House Numbers",
      dataIndex: "houseNumbers",
      key: "houseNumbers",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Actions",
      key: "actions",
      render: (row) => (
        <>
          <Button
            type=""
            className="bg-yellow-500 w-1/2 my-1"
            onClick={() => handleEdit(row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          {row.relativeId && (
            <Button
              type=""
              className="bg-red-500 w-1/2"
              onClick={() => handleDelete(row.relativeId)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full">
      <ToastContainer />
      <div className="flex flex-row gap-5 items-center justify-center w-1/2">
        <Search
          placeholder="Search diaspora relative"
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button onClick={handleRefresh} type="primary">
          Refresh
        </Button>
      </div>
      <div className="flex items-center justify-center w-5/6">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>
      <Modal
        title="Edit Relative"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="relationType"
            label="Relation Type"
            rules={[{ required: true, message: "Please enter relation type" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label="First Name">
            <Input />
          </Form.Item>
          <Form.Item name="middleName" label="Middle Name">
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="region" label="Region">
            <Input />
          </Form.Item>
          <Form.Item name="zone" label="Zone">
            <Input />
          </Form.Item>
          <Form.Item name="district" label="District">
            <Input />
          </Form.Item>
          <Form.Item name="houseNumbers" label="House Numbers">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiasporaRelative;
