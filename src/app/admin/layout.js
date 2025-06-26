"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import Footer from "@/components/admin/Footer";
import { getCurrentUser } from "@/lib/middleware/auth";
import PendaftarPage from "./pendaftar/page";

function AdminLayoutContent({ children }) {
  const { isSidebarOpen, setIsSidebarOpen, activeSubMenu } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  // Don't show layout for login and register pages
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col ${
            isSidebarOpen ? "ml-64" : "ml-0"
          } transition-all duration-300`}
        >
          {/* Navbar */}
          <AdminNavbar />

          {/* Page Content */}
          <main className="p-6 flex-1">
            <div className="mx-auto max-w-7xl">
              {pathname === "/admin/pendaftar" ? <PendaftarPage /> : children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
