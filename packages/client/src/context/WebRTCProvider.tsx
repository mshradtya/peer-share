import { createContext, JSX, ReactNode, useContext, useState } from "react";
import { Copy, Check } from "lucide-react";

interface WebRTCState {
  isConnected: boolean;
  copyIcon: JSX.Element;
  localSDP: string;
  remoteSDP: string;
  addingRemoteSDP: boolean;
  showProgress: boolean;
  progress: number;
  transferStatus: string;
  receivedFileUrl: string | null;
  currentFileMetadata: FileMetaData;

  // setters
  setRemoteSDP: React.Dispatch<React.SetStateAction<string>>;
  setAddingRemoteSDP: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;

  // functions
  copyLocalSDP: () => void;
  createConnection: () => void;
  connectToPeer: () => void;
  startSendingFile: () => void;
}

export const WebRTCContext = createContext<WebRTCState | undefined>(undefined);

interface Chunk {
  data: ArrayBuffer;
  index: number;
}

interface FileMetaData {
  name: string;
  type: string;
}

export const WebRTCProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [copyIcon, setCopyIcon] = useState(<Copy />);
  const [localSDP, setLocalSDP] = useState("");
  const [remoteSDP, setRemoteSDP] = useState("");
  const [addingRemoteSDP, setAddingRemoteSDP] = useState(false);

  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transferStatus, setTransferStatus] = useState("");
  const [receivedFileUrl, setReceivedFileUrl] = useState<string | null>(null);

  const [currentFileMetadata, setCurrentFileMetadata] = useState<FileMetaData>(
    {} as FileMetaData
  );

  const [file, setFile] = useState<File | null>(null);

  const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
  let peerConnection: RTCPeerConnection;
  let dataChannel: RTCDataChannel;

  let currentFileSize = 0;

  let receivedSize = 0;
  let receivedData: ArrayBuffer[] = [];

  // file transfer related variables
  let fileReader: FileReader;

  // flow control variables
  let fileSendQueue: Chunk[] = [];

  // chunk size for file transfer (32 KB)
  const CHUNK_SIZE = 32 * 1024;

  // transfer speed control (ms between chunks)
  let chunkDelay = 5;

  const createConnection = async () => {
    try {
      peerConnection = new RTCPeerConnection({ iceServers });
      dataChannel = peerConnection.createDataChannel("fileTransfer");
      setupDataChannel();

      peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate === null) {
          let withCandidates = JSON.stringify(peerConnection.localDescription);
          setLocalSDP(withCandidates);
        }
      });

      let offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
    } catch (err) {
      console.log(err);
    }
  };

  const connectToPeer = async () => {
    try {
      let remoteSdp = JSON.parse(remoteSDP);

      if (!peerConnection) {
        peerConnection = new RTCPeerConnection({
          iceServers,
        });

        peerConnection.addEventListener("datachannel", (event) => {
          dataChannel = event.channel;
          setupDataChannel();
        });

        peerConnection.addEventListener("icecandidate", (event) => {
          if (event.candidate === null) {
            let withCandidates = JSON.stringify(
              peerConnection.localDescription
            );
            setLocalSDP(withCandidates);
          }
        });
      }

      await peerConnection.setRemoteDescription(remoteSdp);
      setAddingRemoteSDP(false);

      if (remoteSdp.type === "offer") {
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setupDataChannel = () => {
    if (!dataChannel) return;

    dataChannel.addEventListener("open", () => {
      setIsConnected(true);
    });
    dataChannel.addEventListener("close", () => {
      setIsConnected(false);
    });
    dataChannel.addEventListener("message", (event) => {
      let data = event.data;

      // file meta data received - save and enable progress bar
      if (typeof data === "string") {
        const metadata = JSON.parse(data);

        if (metadata.type === "file-info") {
          // reset for new file
          receivedSize = 0;
          receivedData = [];
          currentFileSize = metadata.size;

          // store original filename and mimetype
          setCurrentFileMetadata({
            name: metadata.name,
            type: metadata.mimeType || "application/octet-stream",
          });

          // enable progress bar
          setShowProgress(true);
        }
      } else {
        receivedData.push(data);
        receivedSize += data.byteLength;

        const percentage = Math.floor((receivedSize / currentFileSize) * 100);
        setProgress(percentage);
        setTransferStatus(`Receiving file... ${percentage}%`);

        if (receivedSize === currentFileSize) {
          const receivedFile = new Blob(receivedData, {
            type: currentFileMetadata.type,
          });

          const fileUrl = URL.createObjectURL(receivedFile);
          setReceivedFileUrl(fileUrl);
          setTimeout(() => setShowProgress(false), 2000);
        }
      }
    });
  };

  const startSendingFile = () => {
    if (!file) {
      return;
    }

    if (!dataChannel || dataChannel.readyState !== "open") {
      return;
    }

    // resetting
    fileSendQueue = [];

    // send file meta data first
    const metadata = {
      type: "file-info",
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };

    dataChannel.send(JSON.stringify(metadata));
    setShowProgress(true);
    prepareFileChunks();
  };

  const prepareFileChunks = () => {
    if (!file) return;

    fileReader = new FileReader();
    let offset = 0;
    let chunkIndex = 0;

    const readSlice = async (o: number) => {
      let slice = file.slice(o, o + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(slice);
    };

    const loadChunkToQueue = () => {
      let chunk = fileReader.result as ArrayBuffer;

      fileSendQueue.push({
        data: chunk,
        index: chunkIndex,
      });

      offset += chunk.byteLength;
      chunkIndex++;

      // update preparation progress
      const percentage = Math.floor((offset / file.size) * 100);
      setProgress(percentage);
      setTransferStatus(`Preparing file for Transfer... ${percentage}%`);

      if (offset < file.size) {
        readSlice(offset);
      } else {
        processSendQueue();
      }
    };

    fileReader.addEventListener("load", () => loadChunkToQueue());
    fileReader.addEventListener("error", () => console.log(fileReader.error));

    readSlice(offset);
  };

  const processSendQueue = () => {
    if (fileSendQueue.length === 0) return;
    if (!file) return;

    const chunk = fileSendQueue.shift() as Chunk;

    try {
      dataChannel.send(chunk.data);

      const sentBytes = chunk.index * CHUNK_SIZE;
      const percentage = Math.floor((sentBytes / file.size) * 100);

      setProgress(percentage);
      setTransferStatus(`Sending File... ${percentage}%`);

      // if more chunks to send
      if (fileSendQueue.length > 0) {
        setTimeout(processSendQueue, chunkDelay);
      } else {
        // if this was the last chunk
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        if (chunk.index >= totalChunks - 1) {
          // transfer complete
          setProgress(100);
          setTransferStatus(`Sending File... 100%`);

          setTimeout(() => setShowProgress(false), 2000);
        } else {
          // something went wrong, queue didn't contain all chunks
          console.log(
            "warning: not all chunks were processed. transfer may be incomplete"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const copyLocalSDP = async () => {
    try {
      await navigator.clipboard.writeText(localSDP);
      setCopyIcon(<Check />);
      setTimeout(() => setCopyIcon(<Copy />), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const contextValue: WebRTCState = {
    isConnected,
    copyIcon,
    localSDP,
    remoteSDP,
    addingRemoteSDP,
    showProgress,
    progress,
    transferStatus,
    receivedFileUrl,
    currentFileMetadata,
    // setters
    setRemoteSDP,
    setAddingRemoteSDP,
    setFile,
    // functions
    copyLocalSDP,
    createConnection,
    connectToPeer,
    startSendingFile,
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
