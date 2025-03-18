import { useState, useEffect, useCallback, useRef } from "react";

interface Chunk {
  data: ArrayBuffer;
  index: number;
}

export interface FileMetaData {
  name: string;
  type: string;
}

export interface FileTransferState {
  file: File | null;
  showProgress: boolean;
  progress: number;
  transferStatus: string;
  receivedFileUrl: string | null;
  currentFileMetadata: FileMetaData;

  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  startSendingFile: () => void;
  handleDownload: () => void;
}

export const useFileTransfer = (
  dataChannel: RTCDataChannel | null
): FileTransferState => {
  const [file, setFile] = useState<File | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transferStatus, setTransferStatus] = useState("");
  const [receivedFileUrl, setReceivedFileUrl] = useState<string | null>(null);
  const [currentFileMetadata, setCurrentFileMetadata] = useState<FileMetaData>({
    name: "",
    type: "",
  });

  const fileReaderRef = useRef<FileReader | null>(null);
  const fileSendQueueRef = useRef<Chunk[]>([]);
  const currentFileSizeRef = useRef<number>(0);
  const receivedSizeRef = useRef<number>(0);
  const receivedDataRef = useRef<ArrayBuffer[]>([]);

  // constants
  const CHUNK_SIZE = 32 * 1024; // 32 KB
  const CHUNK_DELAY = 5; // ms

  // Setup data channel message event handling for file reception
  useEffect(() => {
    if (!dataChannel) return;

    const handleMessage = async (event: MessageEvent) => {
      const data = event.data;

      // handle metadata ( strings )
      if (typeof data === "string") {
        try {
          const metadata = JSON.parse(data);

          if (metadata.type === "file-info") {
            // reset for new file
            receivedSizeRef.current = 0;
            receivedDataRef.current = [];
            currentFileSizeRef.current = metadata.size;

            // store metadata
            setCurrentFileMetadata({
              name: metadata.name,
              type: metadata.mimeType || "application/octet-stream",
            });

            // enable progress bar
            setShowProgress(true);
          }
        } catch (err) {
          console.log("Error parsing message:", err);
        }
      } else {
        // handle file chunks
        await new Promise((resolve) => setTimeout(resolve, 5000));
        receivedDataRef.current.push(data);
        receivedSizeRef.current += data.byteLength;

        const percentage = Math.floor(
          (receivedSizeRef.current / currentFileSizeRef.current) * 100
        );

        setProgress(percentage);
        setTransferStatus(`Receiving file... ${percentage}%`);

        // if transfer is complete
        if (receivedSizeRef.current === currentFileSizeRef.current) {
          const receivedFile = new Blob(receivedDataRef.current, {
            type: currentFileMetadata.type,
          });

          const fileUrl = URL.createObjectURL(receivedFile);
          setReceivedFileUrl(fileUrl);
          setTimeout(() => setShowProgress(false), 2000);
        }
      }
    };

    dataChannel.addEventListener("message", handleMessage);

    return () => {
      dataChannel.removeEventListener("message", handleMessage);
    };
  }, [dataChannel, currentFileMetadata.type]);

  const prepareFileChunks = useCallback(() => {
    if (!file) return;

    fileReaderRef.current = new FileReader();
    let offset = 0;
    let chunkIndex = 0;

    const readSlice = (o: number) => {
      const slice = file.slice(o, o + CHUNK_SIZE);
      fileReaderRef.current?.readAsArrayBuffer(slice);
    };

    const loadChunkToQueue = () => {
      if (!fileReaderRef.current || !fileReaderRef.current.result) return;

      const chunk = fileReaderRef.current.result as ArrayBuffer;

      fileSendQueueRef.current.push({
        data: chunk,
        index: chunkIndex,
      });

      offset += chunk.byteLength;
      chunkIndex++;

      const percentage = Math.floor((offset / file.size) * 100);
      setProgress(percentage);
      setTransferStatus(`Preparing file for Transfer... ${percentage}%`);

      if (offset < file.size) {
        readSlice(offset);
      } else {
        processSendQueue();
      }
    };

    const handleError = () => {
      console.log(fileReaderRef.current?.error);
    };

    if (fileReaderRef.current) {
      fileReaderRef.current.addEventListener("load", loadChunkToQueue);
      fileReaderRef.current.addEventListener("error", handleError);
    }

    readSlice(offset);

    // cleanup
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.removeEventListener("load", loadChunkToQueue);
        fileReaderRef.current.removeEventListener("error", handleError);
      }
    };
  }, [file]);

  const processSendQueue = useCallback(() => {
    if (fileSendQueueRef.current.length === 0) return;
    if (!dataChannel || !file) return;

    const chunk = fileSendQueueRef.current.shift() as Chunk;

    try {
      dataChannel.send(chunk.data);

      const sentBytes = chunk.index * CHUNK_SIZE;
      const percentage = Math.floor((sentBytes / file.size) * 100);

      setProgress(percentage);
      setTransferStatus(`Sending File... ${percentage}%`);

      // if more chunks to send
      if (fileSendQueueRef.current.length > 0) {
        setTimeout(processSendQueue, CHUNK_DELAY);
      } else {
        // if this was the last chunk
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        if (chunk.index >= totalChunks - 1) {
          // Transfer complete
          setProgress(100);
          setTransferStatus(`Sending File... 100%`);
          setTimeout(() => setShowProgress(false), 2000);
        } else {
          console.log("Warning: not all chunks were processed");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [dataChannel, file]);

  const startSendingFile = useCallback(() => {
    if (!file || !dataChannel || dataChannel.readyState !== "open") {
      return;
    }

    // reset queue
    fileSendQueueRef.current = [];

    // send file metadata first
    const metadata = {
      type: "file-info",
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };

    dataChannel.send(JSON.stringify(metadata));
    setShowProgress(true);
    prepareFileChunks();
  }, [file, dataChannel, prepareFileChunks]);

  const handleDownload = useCallback(() => {
    if (!receivedFileUrl || !currentFileMetadata.name) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = receivedFileUrl;
    downloadLink.download = currentFileMetadata.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, [receivedFileUrl, currentFileMetadata.name]);

  return {
    file,
    showProgress,
    progress,
    transferStatus,
    receivedFileUrl,
    currentFileMetadata,
    setFile,
    startSendingFile,
    handleDownload,
  };
};
