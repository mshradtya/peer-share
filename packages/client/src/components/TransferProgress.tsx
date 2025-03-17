import React from "react";
import { Progress } from "@/components/ui/progress";
import { useWebRTC } from "@/context/WebRTCProvider";

const TransferProgress: React.FC = () => {
  const { showProgress, progress, transferStatus } = useWebRTC();

  return (
    <>
      {showProgress && (
        <div className="flex flex-col items-center">
          <Progress value={progress} className="w-full my-4" />
          <p>{transferStatus}</p>
        </div>
      )}
    </>
  );
};

export default TransferProgress;
