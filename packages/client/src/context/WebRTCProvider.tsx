import { createContext, ReactNode, useContext, useState } from "react";

interface WebRTCState {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WebRTCContext = createContext<WebRTCState | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  const contextValue: WebRTCState = {
    isConnected,
    setIsConnected,
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
