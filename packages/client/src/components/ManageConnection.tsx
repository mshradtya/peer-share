import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, PlusIcon } from "lucide-react";
import { useWebRTC } from "@/context/WebRTCProvider";
import { Textarea } from "@/components/ui/textarea";

const ManageConnection: React.FC = () => {
  const {
    copyIcon,
    localSDP,
    remoteSDP,
    addingRemoteSDP,
    setRemoteSDP,
    setAddingRemoteSDP,
    copyLocalSDP,
    createConnection,
    connectToPeer,
  } = useWebRTC();

  return (
    <div className="flex flex-col md:flex-row md:gap-3.5 mt-2 w-full">
      {/* local sdp generation */}
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Connection Setup</CardTitle>
          <CardDescription>Your connection info</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-28 md:h-32 rounded-md border p-2 md:p-4">
            {localSDP}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={createConnection} className="text-sm md:text-base">
            Create
          </Button>
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
      <Card className="w-full md:w-1/2 mt-3.5 md:mt-0">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Connect To Peer</CardTitle>
          <CardDescription>Paste your peer's connection info</CardDescription>
        </CardHeader>
        <CardContent>
          {addingRemoteSDP ? (
            <Textarea
              value={remoteSDP}
              onChange={(event) => setRemoteSDP(event.target.value)}
              placeholder="Paste the connection string here"
              className="h-28 md:h-32 rounded-md border"
            />
          ) : (
            <ScrollArea className="h-28 md:h-32 rounded-md border p-2 md:p-4">
              {remoteSDP}
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={connectToPeer} className="text-sm md:text-base">
            Connect
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAddingRemoteSDP((prev) => !prev)}
            >
              {addingRemoteSDP ? <Check /> : <PlusIcon />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageConnection;
