import React from "react";
import { Sidebar, Topbar } from "../components";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content-wrapper">
        <Topbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
