import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DiasporaInfoForm from "./DiasporaInfoForm";
import DiasporaList from "./DiasporaList";


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
      label: "Diaspora List",
      children: <DiasporaList/>,
      forceRender: true,
    },
    {
      key: "3",
      label: "Diaspora Passport",
      children: "",
      forceRender: true,
    },
    {
      key: "4",
      label: "Diaspora Skill",
      children: "",
      forceRender: true,
    },
    {
      key: "5",
      label: "Diaspora Address",
      children: "",
      forceRender: true,
    },
    {
      key: "6",
      label: "Diaspora Relative",
      children: "",
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
