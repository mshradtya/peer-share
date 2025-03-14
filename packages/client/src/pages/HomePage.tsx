import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Share Files Directly,
          <br />
          <span className="text-primary">No Middleman</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          PeerShare enables secure, direct browser-to-browser file transfers
          with no size limits, no uploads to servers, and complete privacy.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button asChild size="lg" className="gap-2">
            <Link to="/share">
              Start Sharing <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/how-it-works">Learn How It Works</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose PeerShare?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our peer-to-peer technology offers advantages that traditional file
            sharing can't match.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Private & Secure</CardTitle>
              <CardDescription>
                Files transfer directly between browsers. Nothing is stored on
                our servers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                End-to-end encryption ensures your files remain private. We
                can't access your data, even if we wanted to.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Fast & Efficient</CardTitle>
              <CardDescription>
                Direct peer connections mean faster transfers with no upload
                waiting time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Skip the upload-then-download process. PeerShare creates a
                direct connection between devices for maximum speed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>No Size Limits</CardTitle>
              <CardDescription>
                Share files of any size without restrictions or storage
                concerns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Traditional services limit file sizes. With PeerShare, you're
                only limited by your device's storage capacity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 px-4 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start sharing?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          No signups, no downloads, no fuss. Just instant, secure file sharing.
        </p>
        <Button asChild size="lg">
          <Link to="/share">Create a Share Room</Link>
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
