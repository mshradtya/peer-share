import React from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Share2 className="h-6 w-6" />
          <span className="font-bold text-xl">PeerShare</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className="hover:text-primary transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Button asChild variant="default">
                <Link to="/share">Start Sharing</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
