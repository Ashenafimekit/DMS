import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import CreateOrganization from "./CreateOrganization";
import OrganizationList from "./OrganizationList";
import DirectorList from "./DirectorList";

const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Add Organization",
      children: <CreateOrganization />,
      forceRender: true,
    },
    {
      key: "2",
      label: "Organization List",
      children: <OrganizationList/>,
      forceRender: true,
    },
    {
        key: "3",
        label: "Director List",
        children: <DirectorList/>,
        forceRender: true,
    },
  ];

  const onChange = (key) => {
   // console.log(key);
  };

  return (
    <div className="text-xl h-screen overflow-y-auto ">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Profile;
