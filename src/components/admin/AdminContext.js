"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [activeSubMenu, setActiveSubMenu] = useState("pendaftar");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Update active sub menu based on current path
  useEffect(() => {
    if (pathname === "/admin/pendaftar") {
      setActiveSubMenu("pendaftar");
    } else if (pathname === "/admin/pendaftar/diterima") {
      setActiveSubMenu("diterima");
    }
  }, [pathname]);

  const value = {
    activeSubMenu,
    setActiveSubMenu,
    isSidebarOpen,
    setIsSidebarOpen,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
