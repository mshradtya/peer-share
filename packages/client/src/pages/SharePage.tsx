import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

const SharePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="max-w-2/3 mx-auto">
      {/* Connection Status */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Connect and Share</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="flex gap-3.5 mt-2">
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Connection Setup</CardTitle>
            <CardDescription>Your connection Info</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              placeholder="Your connection data will appear here"
              className="min-h-32"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Create Connection</Button>
            <Button variant="outline" size="icon">
              <Copy />
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Connect To Peer</CardTitle>
            <CardDescription>Paste your peer's connection info</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your peer's connection data here"
              className="min-h-32"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Connect</Button>
            <Button variant="outline" size="icon">
              <Copy />
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card className="mt-3.5">
        <CardHeader>
          <CardTitle>File Transfer</CardTitle>
          <CardDescription>Choose a file to transfer</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input type="file" />
          <Button disabled={!isConnected}>Send</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharePage;
