import { useWebRTC } from "@/context/WebRTCProvider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const DownloadFile: React.FC = () => {
  const { receivedFileUrl, currentFileMetadata } = useWebRTC();

  const handleDownload = () => {
    if (!receivedFileUrl || !currentFileMetadata) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = receivedFileUrl;
    downloadLink.download = currentFileMetadata.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <>
      {receivedFileUrl && (
        <div className="mt-4 flex justify-center">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download {currentFileMetadata?.name}
          </Button>
        </div>
      )}
    </>
  );
};

export default DownloadFile;
