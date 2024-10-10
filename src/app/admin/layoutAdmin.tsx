
import React from "react";
import Nav from "@/app/admin/navAdmin"
export default function Layout({ children }: { children: React.ReactNode })
{
  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-l-lg">
        {children}
      </div>   
    </div>
  )
}