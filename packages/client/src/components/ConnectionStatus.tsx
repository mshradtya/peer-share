import React from "react";
import { useWebRTC } from "@/context/WebRTCProvider";
import {
  WifiOff,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ConnectionStatus: React.FC = () => {
  const { isConnected, connectionQuality } = useWebRTC();

  const getTooltipText = () => {
    if (!isConnected) return "Disconnected";

    switch (connectionQuality) {
      case "excellent":
        return "Excellent Connection";
      case "good":
        return "Good Connection";
      case "fair":
        return "Fair Connection";
      case "poor":
        return "Poor Connection";
      default:
        return "Connection Quality";
    }
  };

  const renderConnectionIcon = () => {
    if (!isConnected) {
      return <WifiOff className="h-4 w-4 md:h-5 md:w-5 text-red-500" />;
    }

    switch (connectionQuality) {
      case "excellent":
        return <SignalHigh className="h-4 w-4 md:h-5 md:w-5 text-green-500" />;
      case "good":
        return (
          <SignalMedium className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
        );
      case "fair":
        return <SignalLow className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />;
      case "poor":
        return <SignalLow className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />;
      default:
        return <Signal className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex justify-between items-center mb-3 md:mb-4">
      <h1 className="text-sm md:text-2xl font-bold">Connect & Share</h1>
      <div className="flex items-center gap-1 md:gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">{renderConnectionIcon()}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipText()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xs md:text-base">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
