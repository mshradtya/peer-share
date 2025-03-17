import { createContext, useContext, ReactNode } from "react";
import { useConnectionState } from "../hooks/useConnectionState";
import { useFileTransfer } from "../hooks/useFileTransfer";
import type { ConnectionState } from "../hooks/useConnectionState";
import type { FileTransferState } from "../hooks/useFileTransfer";

// combined from custom hooks
type WebRTCState = ConnectionState & FileTransferState & {};

export const WebRTCContext = createContext<WebRTCState | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // custom hooks
  const connectionState = useConnectionState();
  const fileTransferState = useFileTransfer(connectionState.dataChannel);

  // combine the states for the context value
  const contextValue: WebRTCState = {
    ...connectionState,
    ...fileTransferState,
  };

  return (
    <WebRTCContext.Provider value={contextValue}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (context === undefined) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};
