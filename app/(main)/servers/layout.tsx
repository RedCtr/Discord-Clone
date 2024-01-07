import NavigationSideBar from "@/components/navigation/NavigationSideBar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen">
      <div className="hidden md:flex flex-col fixed inset-y-0 z-30 h-full w-[80px]">
        <NavigationSideBar />
      </div>

      <main className="h-full md:pl-[80px] dark:bg-zinc-700 bg-zinc-400">
        {children}
      </main>
    </div>
  );
};

export default layout;
