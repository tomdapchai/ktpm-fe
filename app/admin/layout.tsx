"use client";
import React from "react";
import { logout } from "@/lib/cookies";
import { useRouter } from "next/navigation";
const layout = ({children} : {children: React.ReactNode}) => {
    
  return <div className="w-full h-full relative">
    {children}</div>;
};

export default layout;
