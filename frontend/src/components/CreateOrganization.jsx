import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Select,
  message,
} from "antd";
import axios from "axios";

const { Option } = Select;

const CreateOrganization = () => {
  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    try {
      const response = await axios.post(
        `${apiUrl}/company/create-company`,
        values,
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("response:", response.data.message);
        message.success(response.data.message);
        form.resetFields();
      }
    } catch (error) {
      console.error("error:", error);
      if (error.response) {
        if (error.response.status === 400) {
          message.error(error.response.data.message);
        }
        if (error.response.status === 401) {
          message.error(error.response.data.message);
        }
        if (error.response.status === 500) {
          message.error("Server error");
        }
      } else {
        message.error("Server error");
      }
    }
  };

  return (
    <div className="">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          organizationType: "Private", // Default value for organization type
          status: "Active", // Default value for director status
        }}
        className="flex flex-col justify-center items-center bg-white m-10 rounded-lg shadow-2xl"
      >
        <div className="flex flex-row gap-5 w-3/4 ">
          <div className="w-1/2 p-5 mb-5">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Organization Information
            </h2>
            <Form.Item
              label="Organization Name"
              name="organizationName"
              rules={[
                {
                  required: true,
                  message: "Please enter the organization name",
                },
              ]}
            >
              <Input placeholder="Enter organization name" size="large" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: "Please enter the country" }]}
            >
              <Input placeholder="Enter country" size="large" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter the city" }]}
            >
              <Input placeholder="Enter city" size="large" />
            </Form.Item>

            <Form.Item
              label="Organization Type"
              name="organizationType"
              rules={[
                {
                  required: true,
                  message: "Please select the organization type",
                },
              ]}
            >
              <Select placeholder="Select organization type" size="large">
                <Option value="Private">Private</Option>
                <Option value="Public">Public</Option>
                <Option value="NGO">NGO</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Date of Establishment"
              name="dateOfEstablishment"
              rules={[
                {
                  required: true,
                  message: "Please select the date of establishment",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter the address" }]}
            >
              <Input.TextArea
                placeholder="Enter address"
                rows={2}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email" size="large" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please enter the phone number" },
              ]}
            >
              <Input placeholder="Enter phone number" size="large" />
            </Form.Item>

            <Form.Item
              label="Number of Members"
              name="numberOfMembers"
              rules={[
                {
                  required: true,
                  message: "Please enter the number of members",
                },
              ]}
            >
              <InputNumber
                placeholder="Enter number of members"
                min={1}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Brief Description"
              name="briefDescription"
              rules={[{ message: "Please enter a brief description" }]}
            >
              <Input.TextArea
                placeholder="Enter brief description"
                rows={4}
                size="large"
              />
            </Form.Item>
          </div>
          <div className="w-1/2 p-5">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Director Information
            </h2>
            <Form.Item
              label="Director Name"
              name="directorName"
              rules={[
                { required: true, message: "Please enter the director's name" },
              ]}
            >
              <Input placeholder="Enter director name" size="large" />
            </Form.Item>

            <Form.Item
              label="Father's Name"
              name="fatherName"
              rules={[
                { required: true, message: "Please enter the father's name" },
              ]}
            >
              <Input placeholder="Enter father's name" size="large" />
            </Form.Item>

            <Form.Item
              label="Grandfather's Name"
              name="grandfatherName"
              rules={[
                {
                  required: true,
                  message: "Please enter the grandfather's name",
                },
              ]}
            >
              <Input placeholder="Enter grandfather's name" size="large" />
            </Form.Item>

            <Form.Item
              label="Director Contact"
              name="contact"
              rules={[
                {
                  required: true,
                  message: "Please enter the director's contact",
                },
              ]}
            >
              <Input placeholder="Enter contact information" size="large" />
            </Form.Item>

            <Form.Item
              label="Director Email"
              name="directorEmail"
              rules={[
                {
                  required: true,
                  message: "Please enter the director's email",
                },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email" size="large" />
            </Form.Item>

            <Form.Item
              label="Director Phone"
              name="directorPhone"
              rules={[
                {
                  required: true,
                  message: "Please enter the director's phone number",
                },
              ]}
            >
              <Input placeholder="Enter phone number" size="large" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select the status" }]}
            >
              <Select placeholder="Select status" size="large">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="w-1/2">
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default CreateOrganization;
