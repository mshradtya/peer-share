import React from "react";
import { Github } from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t mt-8 py-4 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-1">
        <p>PeerShare © {year}</p>
        <a
          href="https://github.com/mshradtya/peer-share"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center hover:text-foreground ml-2"
        >
          <Github size={16} className="mr-1" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
