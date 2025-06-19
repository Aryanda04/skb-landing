"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PengumumanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validasi: minimal 3 karakter untuk pencarian
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      toast.error("Silakan masukkan minimal 3 karakter untuk pencarian");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSearchResult(null);

    try {
      // Coba pencarian dengan parameter 'identifier' yang bisa berupa nama atau NISN
      const response = await fetch(
        `/api/ppdb/search?identifier=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat mencari data");
      }

      if (data.success && data.data.length > 0) {
        setSearchResult(data.data[0]); // Ambil hasil pertama
      } else {
        setErrorMessage(
          "Data tidak ditemukan. Pastikan data yang dimasukkan benar."
        );
      }
    } catch (error) {
      console.error("Error searching:", error);
      setErrorMessage(error.message || "Terjadi kesalahan saat mencari data");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      incomplete_docs: "bg-orange-100 text-orange-800",
      rejected: "bg-red-100 text-red-800",
      approved: "bg-green-100 text-green-800",
    };

    const statusLabels = {
      pending: "Menunggu Verifikasi",
      incomplete_docs: "Dokumen Tidak Lengkap",
      rejected: "Ditolak",
      approved: "Diterima",
    };

    return (
      <span
        className={`px-3 py-2 rounded-full text-sm font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <Navbar forceScrolled={true} />
      <div className="min-h-screen bg-gray-50 pt-42 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-black sm:text-4xl">
              Pengumuman PPDB
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-black">
              Cek status pendaftaran PPDB SKB Belitung dengan memasukkan nama
              lengkap atau NISN yang terdaftar.
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Masukkan Nama Lengkap atau NISN
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 py-3 px-4 text-black"
                      placeholder="Contoh: Budi Santoso atau 0123456789"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="-ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      Cari
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {searchResult && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-black">
                    Hasil Pencarian
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-700">
                    Detail pendaftaran peserta didik
                  </p>
                </div>
                <div>{getStatusBadge(searchResult.status)}</div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-700">
                      Nama Lengkap
                    </dt>
                    <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                      {searchResult.nama || "-"}
                    </dd>
                  </div>
                  {searchResult.nisn && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-700">
                        NISN
                      </dt>
                      <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                        {searchResult.nisn}
                      </dd>
                    </div>
                  )}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-700">Email</dt>
                    <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                      {searchResult.email || "-"}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-700">
                      Paket Pendidikan
                    </dt>
                    <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                      {searchResult.selectedPackage || "-"}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-700">
                      Tanggal Pendaftaran
                    </dt>
                    <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                      {formatDate(searchResult.createdAt)}
                    </dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-700">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-black sm:mt-0 sm:col-span-2">
                      {searchResult.status === "pending" && (
                        <div className="text-yellow-700">
                          <p className="font-medium">
                            Pendaftaran Anda sedang diproses.
                          </p>
                          <p className="mt-1">
                            Silakan periksa kembali pengumuman ini secara
                            berkala.
                          </p>
                        </div>
                      )}
                      {searchResult.status === "incomplete_docs" && (
                        <div className="text-orange-700">
                          <p className="font-medium">
                            Dokumen Anda tidak lengkap.
                          </p>
                          <p className="mt-1">
                            Silakan lengkapi dokumen yang diperlukan di kantor
                            SKB Belitung.
                          </p>
                        </div>
                      )}
                      {searchResult.status === "rejected" && (
                        <div>
                          <div className="text-red-700 font-medium">
                            Mohon maaf, pendaftaran Anda ditolak.
                          </div>
                          {searchResult.statusKeterangan && (
                            <div className="mt-2 p-3 bg-red-50 rounded-md text-sm text-red-700">
                              <span className="font-medium">
                                Alasan penolakan:
                              </span>{" "}
                              {searchResult.statusKeterangan}
                            </div>
                          )}
                        </div>
                      )}
                      {searchResult.status === "approved" && (
                        <div className="text-green-700">
                          <p className="font-medium">
                            Selamat! Anda diterima sebagai peserta didik di SKB
                            Belitung.
                          </p>
                          <p className="mt-1">
                            Silakan datang ke kantor SKB Belitung untuk
                            melakukan daftar ulang dengan membawa dokumen asli
                            pada:
                          </p>
                          <div className="mt-2 p-3 bg-green-50 rounded-md text-sm">
                            <div className="font-medium">
                              Waktu Daftar Ulang:
                            </div>
                            <div>Tanggal: 1-5 Agustus 2023</div>
                            <div>Jam: 08.00 - 15.00 WIB</div>
                            <div>Tempat: Kantor SKB Belitung</div>
                          </div>
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Footer dengan info kontak */}
              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <div className="text-sm">
                  <p className="font-medium text-gray-700">
                    Butuh informasi lebih lanjut?
                  </p>
                  <p className="mt-1 text-gray-600">
                    Silakan hubungi kantor SKB Belitung di nomor (0719) 22-xxx
                    atau kunjungi kantor kami.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
