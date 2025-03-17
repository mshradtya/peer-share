import React from "react";
import { useWebRTC } from "@/context/WebRTCProvider";

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useWebRTC();

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Connect and Share</h1>
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span>{isConnected ? "Connected" : "Disconnected"}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
