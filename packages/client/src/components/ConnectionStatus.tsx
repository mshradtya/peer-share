import React from "react";
import { useWebRTC } from "@/context/WebRTCProvider";

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useWebRTC();

  return (
    <div className="flex justify-between items-center mb-3 md:mb-4">
      <h1 className="text-sm md:text-2xl font-bold">Connect & Share</h1>
      <div className="flex items-center gap-1 md:gap-2">
        <div
          className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-xs md:text-base">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
