import React, { ChangeEvent, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
let peerConnection: RTCPeerConnection;
let dataChannel: RTCDataChannel;

const iconsMap = {
  copy: <Copy />,
  check: <Check />,
  add: <PlusIcon />,
};

const SharePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [copyIcon, setCopyIcon] = useState(iconsMap["copy"]);
  const [localSDP, setLocalSDP] = useState("");
  const [remoteSDP, setRemoteSDP] = useState("");
  const [addingRemoteSDP, setAddingRemoteSDP] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const createConnection = async () => {
    try {
      peerConnection = new RTCPeerConnection({ iceServers });
      dataChannel = peerConnection.createDataChannel("fileTransfer");
      setupDataChannel();

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

  const connectToPeer = async () => {
    try {
      let remoteSdp = JSON.parse(remoteSDP);

      if (!peerConnection) {
        peerConnection = new RTCPeerConnection({
          iceServers,
        });

        peerConnection.addEventListener("datachannel", (event) => {
          dataChannel = event.channel;
          setupDataChannel();
        });

        peerConnection.addEventListener("icecandidate", (event) => {
          if (event.candidate === null) {
            let withCandidates = JSON.stringify(
              peerConnection.localDescription
            );
            setLocalSDP(withCandidates);
          }
        });
      }

      await peerConnection.setRemoteDescription(remoteSdp);
      setAddingRemoteSDP(false);

      if (remoteSdp.type === "offer") {
        let answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setupDataChannel = () => {
    if (!dataChannel) return;

    dataChannel.addEventListener("open", () => {
      setIsConnected(true);
    });
    dataChannel.addEventListener("close", () => {
      setIsConnected(false);
    });
    dataChannel.addEventListener("message", () => {});
  };

  const copyLocalSDP = async () => {
    try {
      await navigator.clipboard.writeText(localSDP);
      setCopyIcon(iconsMap["check"]);
      setTimeout(() => setCopyIcon(iconsMap["copy"]), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    setFile(files[0]);
  };

  const startSendingFile = () => {
    if (!file) {
      return;
    }

    if (!dataChannel || dataChannel.readyState !== "open") {
      return;
    }
  };

  return (
    <div className="max-w-2/3 mx-auto">
      {/* connection status */}
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
        {/* local sdp generation  */}
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
        {/* remote sdp registration */}
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle>Connect To Peer</CardTitle>
            <CardDescription>Paste your peer's connection info</CardDescription>
          </CardHeader>
          <CardContent>
            {addingRemoteSDP ? (
              <Textarea
                value={remoteSDP}
                onChange={(event) => setRemoteSDP(event.target.value)}
                placeholder="Paste the connection string here"
                className="h-32 rounded-md border"
              />
            ) : (
              <ScrollArea className="h-32 rounded-md border p-4">
                {remoteSDP}
              </ScrollArea>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={connectToPeer}>Connect</Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAddingRemoteSDP((prev) => !prev)}
              >
                {addingRemoteSDP ? iconsMap["check"] : iconsMap["add"]}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* select file to transfer */}
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
    </div>
  );
};

export default SharePage;
