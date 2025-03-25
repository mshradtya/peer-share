import { useWebRTC } from "@/context/WebRTCProvider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const DownloadFile: React.FC = () => {
  const { handleDownload, receivedFiles } = useWebRTC();

  return (
    <>
      {receivedFiles &&
        receivedFiles.map((file, index) => (
          <div key={index} className="mt-4 flex justify-center">
            <Button onClick={() => handleDownload(file.name, file.url)}>
              <Download className="mr-2 h-4 w-4" />
              Download {file.name}
            </Button>
          </div>
        ))}
    </>
  );
};

export default DownloadFile;
