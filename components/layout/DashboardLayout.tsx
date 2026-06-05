"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { UserProvider } from "@/components/providers/UserProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          <Sidebar />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-72">
            <Navbar />
            <main className="flex-1 space-y-6 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-16 sm:space-y-8 sm:p-6 sm:pt-20 lg:pb-8 lg:p-8 lg:pt-8">
              {children}
            </main>
          </div>
        </div>
        <MobileNav />
      </div>
    </UserProvider>
  );
}
