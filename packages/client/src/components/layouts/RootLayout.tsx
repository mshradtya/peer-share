import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

const RootLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
