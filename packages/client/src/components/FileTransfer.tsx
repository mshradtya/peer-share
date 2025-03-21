import React, { ChangeEvent, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/context/WebRTCProvider";

const FileTransfer: React.FC = () => {
  const { isConnected, setFile, startSendingFile, file } = useWebRTC();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    setFile(files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  return (
    <Card className="mt-3 md:mt-4">
      <CardHeader className="px-4 md:px-6 py-3 md:py-4">
        <CardTitle className="text-lg md:text-xl">File Transfer</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Choose a file to transfer
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:gap-4 px-4 md:px-6 pb-4 md:pb-6">
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          className={`border-dashed cursor-pointer rounded-md border-2 ${
            isDragging ? "border-primary bg-primary/5" : "border-zinc-400"
          } w-full min-h-20 md:min-h-28 flex flex-col justify-center items-center gap-2 p-3 md:p-4 transition-colors`}
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-6 w-6 md:h-8 md:w-8 text-zinc-400" />
          <div className="text-center">
            <p className="text-sm md:text-base">
              Drag files here or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1 px-2">
              Files will be transferred directly to your peer
            </p>
          </div>
        </div>

        {file && (
          <div className="border rounded-md p-3 md:p-4 mt-2">
            <h3 className="text-sm font-medium mb-2">Selected file</h3>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 md:gap-3 max-w-[calc(100%-40px)]">
                <File className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0 text-primary" />
                <div className="overflow-hidden">
                  <p className="font-medium text-sm md:text-base truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8 md:w-8 rounded-full flex-shrink-0"
                onClick={handleClearFile}
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center items-center mt-3">
          <Button
            disabled={!isConnected}
            onClick={startSendingFile}
            className="w-auto"
          >
            Send File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileTransfer;
