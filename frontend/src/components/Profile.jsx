import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DiasporaInfoForm from "./DiasporaInfoForm";


const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Personal Info",
      children: <DiasporaInfoForm/>,
      forceRender: true,
    },
    {
      key: "2",
      label: "Family Info",
      children: "content two",
      forceRender: true,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div className="text-lg h-screen overflow-y-auto ">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Profile;
