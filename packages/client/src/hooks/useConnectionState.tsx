import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { JSX } from "react";

enum ConnectionQuality {
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
}

export interface ConnectionState {
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
  copyIcon: JSX.Element;
  localSDP: string;
  remoteSDP: string;
  addingRemoteSDP: boolean;
  connectionQuality: ConnectionQuality | undefined;

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
  const [connectionQuality, setConnectionQuality] = useState<
    ConnectionQuality | undefined
  >(undefined);

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

  const analyzeConnectionQuality = async () => {
    if (peerConnection?.connectionState !== "connected") return;
    const stats = await peerConnection.getStats(null);
    let rtt; // round trip time
    let score = 0;

    stats.forEach((report) => {
      if (report.type === "candidate-pair" && report.nominated)
        rtt = report.currentRoundTripTime || 0;
    });

    if (rtt) {
      if (rtt < 0.02) score += 7; // under 20ms: excellent
      else if (rtt < 0.1) score += 5; // under 100ms: good
      else if (rtt < 0.25) score += 3; // under 250ms: fair

      if (score >= 7) return ConnectionQuality.EXCELLENT;
      if (score >= 5) return ConnectionQuality.GOOD;
      if (score >= 3) return ConnectionQuality.FAIR;
      return ConnectionQuality.POOR;
    }
  };

  setInterval(async () => {
    const connectionQuality = await analyzeConnectionQuality();
    if (connectionQuality) setConnectionQuality(connectionQuality);
  }, 5000);

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
    connectionQuality,
    setRemoteSDP,
    setAddingRemoteSDP,
    createConnection,
    connectToPeer,
    copyLocalSDP,
    setupDataChannel,
  };
};
