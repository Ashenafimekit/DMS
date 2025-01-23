import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import DiasporaInfoForm from "./DiasporaInfoForm";
import DiasporaList from "./DiasporaList";
import DiasporaPassport from "./DiasporaPassport";
import DiasporaAddress from "./DiasporaAddress";
import DiasporaSkill from "./DiasporaSkill";
import DiasporaRelative from "./DiasporaRelative";

const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Add Diaspora",
      children: <DiasporaInfoForm />,
      forceRender: true,
    },
    {
      key: "2",
      label: "Diaspora List",
      children: <DiasporaList />,
      forceRender: true,
    },
    {
      key: "3",
      label: "Diaspora Passport",
      children: <DiasporaPassport />,
      forceRender: true,
    },
    {
      key: "4",
      label: "Diaspora Address",
      children: <DiasporaAddress />,
      forceRender: true,
    },
    {
      key: "5",
      label: "Diaspora Skill",
      children: <DiasporaSkill />,
      forceRender: true,
    },
    {
      key: "6",
      label: "Diaspora Relative",
      children: <DiasporaRelative />,
      forceRender: true,
    },
  ];

  const onChange = (key) => {
   // console.log(key);
  };

  return (
    <div className="text-xl h-screen overflow-y-auto px-5">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Profile;
