import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    </div>
  );
};

export default HomePage;
