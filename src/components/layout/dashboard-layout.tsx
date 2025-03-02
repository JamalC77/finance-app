"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <aside 
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </aside>
        <div 
          className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 