import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, PlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
let peerConnection: RTCPeerConnection;
let dataChannel: RTCDataChannel;

const iconsMap = {
  copy: <Copy />,
  copied: <Check />,
  add: <PlusIcon />,
};

const SharePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [copyIcon, setCopyIcon] = useState(iconsMap["copy"]);
  const [localSDP, setLocalSDP] = useState<string>("");
  const [remoteSDP, setRemoteSDP] = useState<string>("");

  const createConnection = async () => {
    try {
      peerConnection = new RTCPeerConnection({ iceServers });
      dataChannel = peerConnection.createDataChannel("fileTransfer");

      peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate === null) {
          let withCandidates = JSON.stringify(peerConnection.localDescription);
          setLocalSDP(withCandidates);
        }
      });

      let offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
    } catch (err) {
      console.log(err);
    }
  };

  const copyLocalSDP = async () => {
    try {
      await navigator.clipboard.writeText(localSDP);
      setCopyIcon(iconsMap["copied"]);
      setTimeout(() => setCopyIcon(iconsMap["copy"]), 2000);
    } catch (err) {
      console.log(err);
    }
  };

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
            <ScrollArea className="h-32 rounded-md border p-4">
              {localSDP}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={createConnection}>Create Connection</Button>
            <Button
              disabled={!localSDP}
              variant="outline"
              size="icon"
              onClick={copyLocalSDP}
            >
              {copyIcon}
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Connect To Peer</CardTitle>
            <CardDescription>Paste your peer's connection info</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32 rounded-md border p-4">
              {remoteSDP}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>Connect</Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                {iconsMap["add"]}
              </Button>
              <Button variant="outline" size="icon">
                <Copy />
              </Button>
            </div>
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
