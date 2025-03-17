import { useWebRTC } from "@/context/WebRTCProvider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const DownloadFile: React.FC = () => {
  const { receivedFileUrl, currentFileMetadata, handleDownload } = useWebRTC();

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
