"use client";

import { useState, useEffect } from "react";
import { PlayIcon, MaximizeIcon, MinimizeIcon } from "lucide-react";

export default function Navbar({ onClick }: { onClick: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      doc.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="px-4 py-2 bg-[#141414] text-sm border-b border-gray-700 flex justify-between items-center">
      <div className="font-semibold">Main.js</div>
      <div className="flex items-center gap-4 justify-end w-full">
        {/* <button title="Share" className="hover:text-blue-400 transition">
          <Share2Icon className="w-5 h-5" />
        </button> */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="hover:text-blue-400 transition"
        >
          {isFullscreen ? (
            <MinimizeIcon className="w-5 h-5" />
          ) : (
            <MaximizeIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={onClick}
          title="Run Code"
          className=" px-3 py-1 rounded  bg-[linear-gradient(to_right,hsl(34,100%,50%)_0%_50%,hsl(46,100%,50%))] transition-all duration-500 bg-[length:200%_auto] text-[#151515]"
        >
          <div className="flex items-center font-bold gap-1">
            <PlayIcon className="w-4 h-4" strokeWidth={2.5} />
            Run
          </div>
        </button>
      </div>
    </div>
  );
}
