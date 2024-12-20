"use client";

import React, { useState } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoData, VideoDataContext } from "../_context/VideoDataContext";

function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [videoData, setVideoData] = useState<VideoData | null>(null); // Initialize with null or your default value

  return (
    <>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <div>
          <div className="hidden md:block h-screen bg-white absolute mt-[65px]">
            <SideNav />
          </div>
          <div>
            <Header />
            <div className="md:ml-64 p-10">{children}</div>
          </div>
        </div>
      </VideoDataContext.Provider>
    </>
  );
}

export default DashboardLayout;
