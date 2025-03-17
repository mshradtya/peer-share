import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Server, Code, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">How PeerShare Works</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Peer-to-Peer Technology</h2>
        <p className="text-lg mb-6">
          PeerShare uses WebRTC technology to create direct connections between
          browsers, allowing files to transfer directly from one device to
          another without going through a server.
        </p>

        <div className="border rounded-lg p-6 bg-muted/30">
          <h3 className="flex items-center gap-2 text-xl font-medium mb-4">
            <Code className="h-5 w-5" />
            Technical Overview
          </h3>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Create Connection</strong>: When you click "Create
              Connection", your browser generates connection information (SDP).
            </li>
            <li>
              <strong>Exchange Connection Info</strong>: Share your connection
              info with your peer using your preferred method (messaging app,
              email, etc.), and they'll provide their connection info in return.
            </li>
            <li>
              <strong>Connect to Peer</strong>: Paste your peer's connection
              info and click "Connect" to establish a secure, encrypted
              peer-to-peer connection.
            </li>
            <li>
              <strong>File Transfer</strong>: Once connected, select a file and
              click "Send" to transfer it directly to your peer in optimized
              chunks.
            </li>
            <li>
              <strong>Download</strong>: After the transfer completes, your peer
              can download the file directly to their device.
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-12 space-y-6">
        <h2 className="text-2xl font-semibold">Key Benefits</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Privacy & Security</h3>
            </div>
            <p>
              Your files never touch our servers. The peer-to-peer connection is
              encrypted end-to-end, ensuring that only you and your recipient
              can access the files being shared.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Speed & Efficiency</h3>
            </div>
            <p>
              Direct connections mean faster transfers. There's no uploading to
              a server and then downloading - files move directly from sender to
              recipient at the fastest speed your connection allows.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">No Size Limits</h3>
            </div>
            <p>
              Without server-side storage constraints, file size is limited only
              by your device's capabilities. Share large videos, collections of
              photos, or entire project folders without limits.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Copy className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium">No Signaling Server</h3>
            </div>
            <p>
              Our direct connection approach eliminates the need for signaling
              servers. You and your peer exchange connection information
              directly, ensuring maximum privacy and making the connection
              completely serverless.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">
              Is PeerShare really secure?
            </h3>
            <p>
              Yes. We use WebRTC's built-in encryption (DTLS-SRTP) for all
              peer-to-peer connections. The connection is encrypted end-to-end,
              and we never store your files on our servers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">
              What happens if my connection drops?
            </h3>
            <p>
              If the connection is interrupted, the transfer will pause. You'll
              need to re-establish the connection by exchanging connection
              information again and restart the transfer.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">
              How do I share my connection information?
            </h3>
            <p>
              After clicking "Create Connection", use the "Copy" button to copy
              your connection string. Then share it with your peer through any
              messaging platform, email, or chat app. They will need to paste it
              into their "Connect To Peer" section.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">
              Do I need to create an account?
            </h3>
            <p>
              No. PeerShare works without accounts or registration. Simply
              create a connection, exchange information with your peer, and
              start transferring files immediately.
            </p>
          </div>
        </div>
      </section>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to try it yourself?
        </h2>
        <Button asChild size="lg">
          <Link to="/share" className="gap-2">
            Start Sharing <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HowItWorksPage;
