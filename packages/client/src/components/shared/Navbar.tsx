import React from "react";
import { Link } from "react-router-dom";
import { Share2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../mode-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  return (
    <header className="border-b relative z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Share2 className="h-6 w-6" />
          <span className="font-bold text-xl">PeerShare</span>
        </Link>
        <nav className="flex gap-4 items-center">
          <ModeToggle />
          {/* desktop nav */}
          <div className="hidden md:block">
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
          </div>

          {/* mobile nav */}
          <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="text-left border-b pb-2">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <ul className="flex flex-col gap-6">
                    <li>
                      <SheetClose asChild>
                        <Link
                          to="/"
                          className="text-lg py-2 hover:text-primary transition-colors flex justify-center"
                        >
                          Home
                        </Link>
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild>
                        <Link
                          to="/how-it-works"
                          className="text-lg py-2 hover:text-primary transition-colors flex justify-center"
                        >
                          How It Works
                        </Link>
                      </SheetClose>
                    </li>
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
