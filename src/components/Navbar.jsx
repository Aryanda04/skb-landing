"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = ({ forceScrolled = false }) => {
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0 || forceScrolled);
    };

    // Set initial state
    setIsScrolled(window.scrollY > 0 || forceScrolled);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceScrolled]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logos */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/Logo_Belitung.png"
                alt="Logo Kabupaten Belitung"
                fill
                className="object-contain"
              />
            </div>
            {/* <div className="h-14 w-0.5 bg-gray-300"></div> */}
            <div className="relative h-14 w-14">
              <Image
                src="/skbbelitung.jpg"
                alt="Logo SKB Belitung"
                fill
                className="object-contain"
              />
            </div>
            <span
              className={`text-xl font-bold ${
                isScrolled ? "text-[#1e3a8a]" : "text-white"
              } ml-2 hidden sm:block`}
            >
              SKB Belitung
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#tentang"
              className={`${
                isScrolled ? "text-gray-800" : "text-white"
              } hover:text-[#2563eb] transition-colors`}
            >
              Tentang Kami
            </Link>

            <Link
              href="/#program"
              className={`${
                isScrolled ? "text-gray-800" : "text-white"
              } hover:text-[#2563eb] transition-colors`}
            >
              Program
            </Link>

            <Link
              href="/#berita"
              className={`${
                isScrolled ? "text-gray-800" : "text-white"
              } hover:text-[#2563eb] transition-colors`}
            >
              Berita
            </Link>

            <Link
              href="/#galeri"
              className={`${
                isScrolled ? "text-gray-800" : "text-white"
              } hover:text-[#2563eb] transition-colors`}
            >
              Galeri
            </Link>

            {/* PPDB Dropdown */}
            <div className="relative group">
              <button
                className={`${
                  isScrolled ? "text-gray-800" : "text-white"
                } hover:text-[#2563eb] transition-colors flex items-center`}
              >
                PPDB
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 pt-5 w-48 hidden group-hover:block">
                <div className="bg-white rounded-md shadow-lg py-2 border border-gray-200">
                  <Link
                    href="/daftar-ulang"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-semibold"
                  >
                    Daftar Ulang
                  </Link>
                  <Link
                    href="/ppdb"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Pendaftaran
                  </Link>
                  <Link
                    href="/ppdb/pengumuman"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Pengumuman
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/#kontak"
              className={`${
                isScrolled ? "text-gray-800" : "text-white"
              } hover:text-[#2563eb] transition-colors`}
            >
              Kontak
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg
              className={`w-6 h-6 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isDropdownOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 py-2">
            <Link
              href="/#tentang"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="/#program"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Program
            </Link>
            <Link
              href="/#berita"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Berita
            </Link>
            <Link
              href="/#galeri"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Galeri
            </Link>
            <div className="px-4 py-2">
              <div className="font-medium text-gray-800 mb-2">PPDB</div>
              <div className="pl-4 space-y-2">
                <Link
                  href="/daftar-ulang"
                  className="block text-gray-600 hover:text-[#2563eb] font-semibold"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Daftar Ulang
                </Link>
                <Link
                  href="/ppdb"
                  className="block text-gray-600 hover:text-[#2563eb]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Pendaftaran
                </Link>
                <Link
                  href="/ppdb/pengumuman"
                  className="block text-gray-600 hover:text-[#2563eb]"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Pengumuman
                </Link>
              </div>
            </div>
            <Link
              href="/#kontak"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Kontak
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
