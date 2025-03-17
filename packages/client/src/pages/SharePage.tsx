import React from "react";
import ConnectionStatus from "@/components/ConnectionStatus";
import ManageConnection from "@/components/ManageConnection";
import FileTransfer from "@/components/FileTransfer";
import TransferProgress from "@/components/TransferProgress";
import DownloadFile from "@/components/DownloadFile";

const SharePage: React.FC = () => {
  return (
    <div className="max-w-2/3 mx-auto">
      {/* connection status */}
      <ConnectionStatus />
      {/* manage connection */}
      <ManageConnection />
      {/* select file to transfer */}
      <FileTransfer />
      {/* progress bar */}
      <TransferProgress />
      {/* download file */}
      <DownloadFile />
    </div>
  );
};

export default SharePage;
