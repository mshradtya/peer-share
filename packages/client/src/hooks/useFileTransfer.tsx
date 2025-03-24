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
  files: File[];
  showProgress: boolean;
  progress: number;
  transferStatus: string;
  receivedFileUrl: string | null;
  currentFileMetadata: FileMetaData;

  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  startSendingFile: () => void;
  handleDownload: () => void;
}

export const useFileTransfer = (
  dataChannel: RTCDataChannel | null
): FileTransferState => {
  const [files, setFiles] = useState<File[]>([]);
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
  const MAX_BUFFER_SIZE = 16; // 16 mb

  // Setup data channel message event handling for file reception
  useEffect(() => {
    if (!dataChannel) return;

    const handleMessage = (event: MessageEvent) => {
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
    if (files.length === 0) return;

    fileReaderRef.current = new FileReader();
    let offset = 0;
    let chunkIndex = 0;

    const readSlice = (o: number) => {
      const slice = files[0].slice(o, o + CHUNK_SIZE);
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

      const percentage = Math.floor((offset / files[0].size) * 100);
      setProgress(percentage);
      setTransferStatus(`Preparing file for Transfer... ${percentage}%`);

      if (offset < files[0].size) {
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
  }, [files]);

  const processSendQueue = useCallback(() => {
    if (fileSendQueueRef.current.length === 0) return;
    if (!dataChannel || files.length === 0) return;

    const chunk = fileSendQueueRef.current.shift() as Chunk;

    const bufferPercentage =
      dataChannel.bufferedAmount / (1024 * 1024) / MAX_BUFFER_SIZE;

    try {
      dataChannel.send(chunk.data);

      const sentBytes = chunk.index * CHUNK_SIZE;
      const percentage = Math.floor((sentBytes / files[0].size) * 100);

      setProgress(percentage);
      setTransferStatus(`Sending File... ${percentage}%`);

      // if more chunks to send
      if (fileSendQueueRef.current.length > 0) {
        if (bufferPercentage > 0.8) {
          // buffer almost full - even more delay
          setTimeout(processSendQueue, CHUNK_DELAY * 20);
        } else if (bufferPercentage > 0.7) {
          // buffer almost more than half - more delay
          setTimeout(processSendQueue, CHUNK_DELAY * 10);
        } else if (bufferPercentage > 0.5) {
          // buffer almost half - little delay
          setTimeout(processSendQueue, CHUNK_DELAY * 5);
        } else {
          // buffer almost empty - normal delay
          setTimeout(processSendQueue, CHUNK_DELAY);
        }
      } else {
        // if this was the last chunk
        const totalChunks = Math.ceil(files[0].size / CHUNK_SIZE);

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
  }, [dataChannel, files]);

  const startSendingFile = useCallback(() => {
    if (
      files.length === 0 ||
      !dataChannel ||
      dataChannel.readyState !== "open"
    ) {
      return;
    }

    // reset queue
    fileSendQueueRef.current = [];
    let file = files[0];

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
  }, [files, dataChannel, prepareFileChunks]);

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
    files,
    showProgress,
    progress,
    transferStatus,
    receivedFileUrl,
    currentFileMetadata,
    setFiles,
    startSendingFile,
    handleDownload,
  };
};
