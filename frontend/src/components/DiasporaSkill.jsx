import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { Search } = Input;

const DiasporaSkill = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/diaspora/diaspora-skill`, {
        withCredentials: true,
      });

      const diasporaList = response.data.diaspora;
      const skillList = response.data.diasporaSkill;

      const rows = [];
      diasporaList.forEach((diaspora) => {
        const skills = skillList.filter(
          (skill) => skill.diasporaID === diaspora._id
        );

        if (skills.length > 0) {
          skills.forEach((skill, index) => {
            rows.push({
              key: `${diaspora._id}-${index}`,
              diasporaName: `${diaspora.firstName} ${diaspora.middleName} ${diaspora.lastName}`,
              showDiasporaName: index === 0, // New field to control when to render the name
              expertise: skill.expertise || "N/A",
              expertiseField: skill.expertiseField || "N/A",
              educationalBackground: skill.educationalBackground || "N/A",
              expertiseCountry: skill.expertiseCountry || "N/A",
              professionalExperience: skill.professionalExperience || "N/A",
              professionalAffiliation: skill.professionalAffiliation || "N/A",
              shortBio: skill.shortBio || "N/A",
              skillId: skill._id,
            });
          });
        } else {
          rows.push({
            key: `${diaspora._id}-no-skill`,
            diasporaName: `${diaspora.firstName} ${diaspora.middleName} ${diaspora.lastName}`,
            showDiasporaName: true,
            expertise: "No Skills Found",
            expertiseField: "N/A",
            educationalBackground: "N/A",
            expertiseCountry: "N/A",
            professionalExperience: "N/A",
            professionalAffiliation: "N/A",
            shortBio: "N/A",
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

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    form.setFieldsValue(skill);
    setIsEditing(true);
  };

  const handleDelete = async (skillId) => {
    try {
      await axios.delete(`${apiUrl}/diaspora/skill-delete/${skillId}`, {
        withCredentials: true,
      });
      toast.success("Skill deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete skill.");
      console.error(error);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(
        `${apiUrl}/diaspora/diaspora-skill-edit/${editingSkill.skillId}`,
        values,
        {
          withCredentials: true,
        }
      );
      toast.success("Skill updated successfully!");
      setIsEditing(false);
      setEditingSkill(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update skill.");
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
      title: "Expertise",
      dataIndex: "expertise",
      key: "expertise",
    },
    {
      title: "Field",
      dataIndex: "expertiseField",
      key: "expertiseField",
    },
    {
      title: "Country",
      dataIndex: "expertiseCountry",
      key: "expertiseCountry",
    },
    {
      title: "Educational Background",
      dataIndex: "educationalBackground",
      key: "educationalBackground",
    },
    {
      title: "Professional Experience",
      dataIndex: "professionalExperience",
      key: "professionalExperience",
    },
    {
      title: "Professional Affiliation",
      dataIndex: "professionalAffiliation",
      key: "professionalAffiliation",
    },
    {
      title: "Short Bio",
      dataIndex: "shortBio",
      key: "shortBio",
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
          {row.skillId && (
            <Button
              type=""
              className="bg-red-500 w-1/2"
              onClick={() => handleDelete(row.skillId)}
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
          placeholder="Search diaspora skill"
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
        title="Edit Skill"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="expertise"
            label="Expertise"
            rules={[{ required: true, message: "Please enter expertise" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="expertiseField" label="Field">
            <Input />
          </Form.Item>
          <Form.Item name="educationalBackground" label="Education">
            <Input />
          </Form.Item>
          <Form.Item name="expertiseCountry" label="Country">
            <Input />
          </Form.Item>
          <Form.Item name="professionalExperience" label="Experience">
            <Input />
          </Form.Item>
          <Form.Item name="professionalAffiliation" label="Affiliation">
            <Input />
          </Form.Item>
          <Form.Item name="shortBio" label="Short Bio">
            <Input.TextArea rows={4} />
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

export default DiasporaSkill;
