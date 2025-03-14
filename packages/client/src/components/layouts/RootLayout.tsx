import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";

const RootLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
