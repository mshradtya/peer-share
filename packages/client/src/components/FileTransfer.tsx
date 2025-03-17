import React, { ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/context/WebRTCProvider";

const FileTransfer: React.FC = () => {
  const { isConnected, setFile, startSendingFile } = useWebRTC();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    setFile(files[0]);
  };

  return (
    <Card className="mt-3.5">
      <CardHeader>
        <CardTitle>File Transfer</CardTitle>
        <CardDescription>Choose a file to transfer</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input type="file" onChange={handleFileChange} />
        <Button disabled={!isConnected} onClick={startSendingFile}>
          Send
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileTransfer;
