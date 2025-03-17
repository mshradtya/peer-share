// src/hooks/useConnectionState.tsx
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { JSX } from "react";

export interface ConnectionState {
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
  copyIcon: JSX.Element;
  localSDP: string;
  remoteSDP: string;
  addingRemoteSDP: boolean;

  // Methods
  setRemoteSDP: React.Dispatch<React.SetStateAction<string>>;
  setAddingRemoteSDP: React.Dispatch<React.SetStateAction<boolean>>;
  createConnection: () => Promise<void>;
  connectToPeer: () => Promise<void>;
  copyLocalSDP: () => Promise<void>;
  setupDataChannel: (dataChannel: RTCDataChannel) => void;
}

export const useConnectionState = (): ConnectionState => {
  // connection state
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // UI state
  const [copyIcon, setCopyIcon] = useState<JSX.Element>(<Copy />);
  const [localSDP, setLocalSDP] = useState("");
  const [remoteSDP, setRemoteSDP] = useState("");
  const [addingRemoteSDP, setAddingRemoteSDP] = useState(false);

  const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

  const setupDataChannel = useCallback((dc: RTCDataChannel) => {
    if (!dc) return;

    dc.addEventListener("open", () => {
      setIsConnected(true);
    });

    dc.addEventListener("close", () => {
      setIsConnected(false);
    });
  }, []);

  const createConnection = useCallback(async () => {
    try {
      const pc = new RTCPeerConnection({ iceServers });
      const dc = pc.createDataChannel("fileTransfer");

      setPeerConnection(pc);
      setDataChannel(dc);
      setupDataChannel(dc);

      pc.addEventListener("icecandidate", (event) => {
        if (event.candidate === null) {
          let withCandidates = JSON.stringify(pc.localDescription);
          setLocalSDP(withCandidates);
        }
      });

      let offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    } catch (err) {
      console.log(err);
    }
  }, [setupDataChannel]);

  const connectToPeer = useCallback(async () => {
    try {
      let remoteSdp = JSON.parse(remoteSDP);
      let pc: RTCPeerConnection;

      if (!peerConnection) {
        pc = new RTCPeerConnection({ iceServers });
        setPeerConnection(pc);

        pc.addEventListener("datachannel", (event) => {
          const dc = event.channel;
          setDataChannel(dc);
          setupDataChannel(dc);
        });

        pc.addEventListener("icecandidate", (event) => {
          if (event.candidate === null) {
            let withCandidates = JSON.stringify(pc.localDescription);
            setLocalSDP(withCandidates);
          }
        });

        await pc.setRemoteDescription(remoteSdp);

        if (remoteSdp.type === "offer") {
          let answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
        }
      } else {
        await peerConnection.setRemoteDescription(remoteSdp);
        setAddingRemoteSDP(false);

        if (remoteSdp.type === "offer") {
          let answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [peerConnection, remoteSDP, setupDataChannel]);

  const copyLocalSDP = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(localSDP);
      setCopyIcon(<Check />);
      setTimeout(() => setCopyIcon(<Copy />), 2000);
    } catch (err) {
      console.log(err);
    }
  }, [localSDP]);

  return {
    peerConnection,
    dataChannel,
    isConnected,
    copyIcon,
    localSDP,
    remoteSDP,
    addingRemoteSDP,
    setRemoteSDP,
    setAddingRemoteSDP,
    createConnection,
    connectToPeer,
    copyLocalSDP,
    setupDataChannel,
  };
};
