"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "./AdminContext";

export default function Sidebar() {
  const { activeSubMenu, setActiveSubMenu, isSidebarOpen } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "PPDB",
      path: "/admin/pendaftar",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      hasSubMenu: true,
      subMenu: [
        {
          name: "Daftar Pendaftar",
          key: "pendaftar",
          path: "/admin/pendaftar",
        },
        { name: "Peserta Diterima", key: "diterima", path: "/admin/pendaftar" },
        { name: "Daftar Ulang", key: "daftarUlang", path: "/admin/pendaftar" },
      ],
    },
    {
      name: "Pengaturan",
      path: "/admin/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ];

  const handleSubMenuClick = (subItem) => {
    setActiveSubMenu(subItem.key);
    // Navigate to the pendaftar page with the sub menu state
    router.push("/admin/pendaftar");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <div key={item.path}>
            {item.hasSubMenu ? (
              <div>
                <div className="px-6 py-3 text-gray-700 font-medium flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.icon}
                    />
                  </svg>
                  {item.name}
                </div>
                <div className="ml-6 space-y-1">
                  {item.subMenu.map((subItem) => (
                    <button
                      key={subItem.key}
                      onClick={() => handleSubMenuClick(subItem)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                        activeSubMenu === subItem.key &&
                        pathname === "/admin/pendaftar"
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                  pathname === item.path ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
