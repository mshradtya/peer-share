import { useState, useEffect, useCallback, useRef } from "react";

interface Chunk {
  data: ArrayBuffer;
  index: number;
}

export interface FileMetaData {
  name: string;
  type: string;
}

export interface ReceivedFile {
  name: string;
  url: string;
}

export interface FileTransferState {
  files: File[];
  showProgress: boolean;
  progress: number;
  transferStatus: string;
  currentFileMetadata: FileMetaData;
  receivedFiles: ReceivedFile[];

  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  startSendingFile: () => void;
  handleDownload: (name: string, url: string) => void;
}

export const useFileTransfer = (
  dataChannel: RTCDataChannel | null
): FileTransferState => {
  // sender side
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);

  // receiver side
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [currentFileMetadata, setCurrentFileMetadata] = useState<FileMetaData>({
    name: "",
    type: "",
  });

  // both sides states
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transferStatus, setTransferStatus] = useState("");

  const fileReaderRef = useRef<FileReader | null>(null);
  const fileSendQueueRef = useRef<Chunk[]>([]);
  const currentFileSizeRef = useRef<number>(0);
  const receivedSizeRef = useRef<number>(0);
  const receivedDataRef = useRef<ArrayBuffer[]>([]);

  // constants
  const CHUNK_SIZE = 32 * 1024; // 32 KB
  const CHUNK_DELAY = 5; // ms
  const MAX_BUFFER_SIZE = 16; // 16 mb

  useEffect(() => {
    if (currentFileIndex >= files.length) {
      setFiles([]);
      setCurrentFileIndex(0);
    } else {
      startSendingFile();
    }
  }, [currentFileIndex]);

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
            // setShowProgress(true);
            setTimeout(() => {
              setShowProgress(true);
            }, 1000);
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
        setTransferStatus(
          `Receiving file - ${currentFileMetadata.name}... ${percentage}%`
        );

        // if transfer is complete
        if (receivedSizeRef.current === currentFileSizeRef.current) {
          const receivedFile = new Blob(receivedDataRef.current, {
            type: currentFileMetadata.type,
          });

          const fileUrl = URL.createObjectURL(receivedFile);

          setReceivedFiles((prev) => [
            ...prev,
            { name: currentFileMetadata.name, url: fileUrl },
          ]);
          // setTimeout(() => setShowProgress(false), 2000);
          setShowProgress(false);
        }
      }
    };

    dataChannel.addEventListener("message", handleMessage);

    return () => {
      dataChannel.removeEventListener("message", handleMessage);
    };
  }, [dataChannel, currentFileMetadata]);

  const prepareFileChunks = useCallback(() => {
    if (files.length === 0) return;
    const currentFile = files[currentFileIndex];

    fileReaderRef.current = new FileReader();
    let offset = 0;
    let chunkIndex = 0;

    const readSlice = (o: number) => {
      const slice = currentFile.slice(o, o + CHUNK_SIZE);
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

      const percentage = Math.floor((offset / currentFile.size) * 100);
      setProgress(percentage);
      setTransferStatus(
        `Preparing file - ${currentFile.name} for Transfer... ${percentage}%`
      );

      if (offset < currentFile.size) {
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
  }, [files, currentFileIndex]);

  const processSendQueue = useCallback(() => {
    if (fileSendQueueRef.current.length === 0) return;
    if (!dataChannel || files.length === 0) return;
    const currentFile = files[currentFileIndex];

    const chunk = fileSendQueueRef.current.shift() as Chunk;

    const bufferPercentage =
      dataChannel.bufferedAmount / (1024 * 1024) / MAX_BUFFER_SIZE;

    try {
      dataChannel.send(chunk.data);

      const sentBytes = chunk.index * CHUNK_SIZE;
      const percentage = Math.floor((sentBytes / currentFile.size) * 100);

      setProgress(percentage);
      setTransferStatus(`Sending File - ${currentFile.name}... ${percentage}%`);

      // if more chunks to send
      if (fileSendQueueRef.current.length > 0) {
        // adding delay based on how much buffer is filled
        if (bufferPercentage > 0.8) {
          setTimeout(processSendQueue, CHUNK_DELAY * 20);
        } else if (bufferPercentage > 0.7) {
          setTimeout(processSendQueue, CHUNK_DELAY * 10);
        } else if (bufferPercentage > 0.5) {
          setTimeout(processSendQueue, CHUNK_DELAY * 5);
        } else {
          setTimeout(processSendQueue, CHUNK_DELAY);
        }
      } else {
        // if this was the last chunk
        const totalChunks = Math.ceil(currentFile.size / CHUNK_SIZE);

        if (chunk.index >= totalChunks - 1) {
          // Transfer complete
          setProgress(100);
          setTransferStatus(`Sending File... 100%`);
          setTimeout(() => {
            setShowProgress(false);
            setCurrentFileIndex((prev) => prev + 1);
          }, 2000);
        } else {
          console.log("Warning: not all chunks were processed");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [dataChannel, currentFileIndex, files]);

  const startSendingFile = useCallback(() => {
    if (
      files.length === 0 ||
      currentFileIndex >= files.length ||
      !dataChannel ||
      dataChannel.readyState !== "open"
    ) {
      return;
    }

    // reset queue
    fileSendQueueRef.current = [];
    let currentFile = files[currentFileIndex];

    // send file metadata first
    const metadata = {
      type: "file-info",
      name: currentFile.name,
      size: currentFile.size,
      mimeType: currentFile.type,
    };

    console.log(metadata);

    dataChannel.send(JSON.stringify(metadata));
    setShowProgress(true);
    prepareFileChunks();
  }, [files, currentFileIndex, dataChannel, prepareFileChunks]);

  const handleDownload = useCallback(
    (name: string, url: string) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    [receivedFiles]
  );

  return {
    files,
    showProgress,
    progress,
    transferStatus,
    currentFileMetadata,
    receivedFiles,
    setFiles,
    startSendingFile,
    handleDownload,
  };
};
