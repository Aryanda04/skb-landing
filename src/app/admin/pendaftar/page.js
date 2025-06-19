"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import DetailModal from "@/components/admin/pendaftar/DetailModal";
import Swal from "sweetalert2";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const PAKET_OPTIONS = ["PAKET A", "PAKET B", "PAKET C"];

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Pending" },
  { value: "incomplete_docs", label: "Dokumen Tidak Lengkap" },
  { value: "rejected", label: "Ditolak" },
];

export default function PendaftarPage() {
  const [pendaftar, setPendaftar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPendaftar, setSelectedPendaftar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingWhatsApp, setPendingWhatsApp] = useState(null);
  const [showApproved, setShowApproved] = useState(false);
  // Pagination states
  const [pageNonApproved, setPageNonApproved] = useState(1);
  const [pageApproved, setPageApproved] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [showPackageDropdownNonApproved, setShowPackageDropdownNonApproved] =
    useState(false);
  const [showPackageDropdownApproved, setShowPackageDropdownApproved] =
    useState(false);
  const packageDropdownRefNonApproved = useRef(null);
  const packageDropdownRefApproved = useRef(null);
  // Tambahkan state untuk dropdown status per tabel
  const [showStatusDropdownNonApproved, setShowStatusDropdownNonApproved] =
    useState(false);
  const [showStatusDropdownApproved, setShowStatusDropdownApproved] =
    useState(false);
  const statusDropdownRefNonApproved = useRef(null);
  const statusDropdownRefApproved = useRef(null);

  useEffect(() => {
    fetchPendaftar();
  }, []);

  // Close dropdown on outside click (untuk kedua tabel dan status)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        packageDropdownRefNonApproved.current &&
        !packageDropdownRefNonApproved.current.contains(event.target)
      ) {
        setShowPackageDropdownNonApproved(false);
      }
      if (
        packageDropdownRefApproved.current &&
        !packageDropdownRefApproved.current.contains(event.target)
      ) {
        setShowPackageDropdownApproved(false);
      }
      if (
        statusDropdownRefNonApproved.current &&
        !statusDropdownRefNonApproved.current.contains(event.target)
      ) {
        setShowStatusDropdownNonApproved(false);
      }
      if (
        statusDropdownRefApproved.current &&
        !statusDropdownRefApproved.current.contains(event.target)
      ) {
        setShowStatusDropdownApproved(false);
      }
    }
    if (
      showPackageDropdownNonApproved ||
      showPackageDropdownApproved ||
      showStatusDropdownNonApproved ||
      showStatusDropdownApproved
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    showPackageDropdownNonApproved,
    showPackageDropdownApproved,
    showStatusDropdownNonApproved,
    showStatusDropdownApproved,
  ]);

  const fetchPendaftar = async () => {
    try {
      const response = await fetch("/api/ppdb");
      const data = await response.json();
      if (data.success) {
        setPendaftar(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Gagal mengambil data pendaftar");
      console.error("Error fetching pendaftar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pisahkan data approved dan lainnya
  const approvedPendaftar = pendaftar.filter(
    (item) => item.status === "approved"
  );
  const otherPendaftar = pendaftar.filter((item) => item.status !== "approved");

  // Filter by package
  const filterByPackage = (arr) =>
    selectedPackage === "all"
      ? arr
      : arr.filter((item) => item.selectedPackage === selectedPackage);

  // Search hanya berdasarkan nama
  const filteredOtherPendaftar = filterByPackage(otherPendaftar).filter(
    (item) => {
      const matchesSearch = item.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    }
  );

  const filteredApprovedPendaftar = filterByPackage(approvedPendaftar).filter(
    (item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalNonApproved = filteredOtherPendaftar.length;
  const totalApproved = filteredApprovedPendaftar.length;
  const totalNonApprovedPages = Math.ceil(totalNonApproved / pageSize);
  const totalApprovedPages = Math.ceil(totalApproved / pageSize);

  const paginatedNonApproved = filteredOtherPendaftar.slice(
    (pageNonApproved - 1) * pageSize,
    pageNonApproved * pageSize
  );
  const paginatedApproved = filteredApprovedPendaftar.slice(
    (pageApproved - 1) * pageSize,
    pageApproved * pageSize
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "incomplete_docs":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (pendaftar) => {
    setSelectedPendaftar(pendaftar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPendaftar(null);
  };

  const getMissingDocuments = (pendaftar) => {
    const requiredDocs = [
      { key: "aktaKelahiran", label: "Akta Kelahiran" },
      { key: "kartuKeluarga", label: "Kartu Keluarga" },
      { key: "ktp", label: "KTP" },
      { key: "ijazahTerakhir", label: "Ijazah Terakhir" },
    ];

    if (pendaftar.isTransferStudent) {
      requiredDocs.push({
        key: "suratPindah",
        label: "Surat Keterangan Pindah",
      });
    }

    return requiredDocs
      .filter((doc) => !pendaftar[doc.key])
      .map((doc) => doc.label)
      .join(", ");
  };

  // Pagination component
  const Pagination = ({ page, totalPages, onPageChange }) => (
    <div className="flex justify-end items-center gap-2 mt-4 pb-4 pr-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded-lg border shadow-sm font-semibold transition-all duration-150 flex items-center justify-center
          ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-blue-100 hover:text-blue-700"
          }`}
        aria-label="Sebelumnya"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded-lg border font-semibold mx-0.5 transition-all duration-150
            ${
              page === i + 1
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-black hover:bg-blue-100 hover:text-blue-700"
            }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || totalPages === 0}
        className={`px-3 py-1 rounded-lg border shadow-sm font-semibold transition-all duration-150 flex items-center justify-center
          ${
            page === totalPages || totalPages === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-blue-100 hover:text-blue-700"
          }`}
        aria-label="Berikutnya"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  // Icon components
  const EyeIcon = () => (
    <svg
      className="w-5 h-5 text-blue-600 hover:text-blue-900"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
  const WhatsAppIcon = () => (
    <svg
      className="w-5 h-5 text-green-600 hover:text-green-800"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.64 6.06L0 24l6.18-1.62A12.09 12.09 0 0012 24c6.63 0 12-5.37 12-12a11.93 11.93 0 00-3.48-8.52zM12 22a9.93 9.93 0 01-5.1-1.39l-.36-.21-3.67.96.98-3.58-.23-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
    </svg>
  );
  const FilterIcon = () => (
    <svg
      className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
      />
    </svg>
  );

  // Fungsi untuk generate pesan WhatsApp sesuai status
  function getWhatsAppMessage(pendaftar) {
    if (pendaftar.status === "incomplete_docs") {
      return `Pendaftaran anda di SKB sudah masuk namun anda masih harus melengkapi dokumen yang kurang. Silakan segera lengkapi dokumen anda ke SKB.\n\nAlamat: Jl. Pendidikan No. 123, Kota\nJam Operasional: Senin - Jumat, 08:00 - 16:00`;
    } else if (pendaftar.status === "rejected") {
      return `Mohon maaf, pendaftaran anda di SKB Belitung *DITOLAK*.\n\nAlasan: ${
        pendaftar.statusKeterangan || "-"
      }\n\nSilakan hubungi admin untuk informasi lebih lanjut.`;
    } else if (pendaftar.status === "approved") {
      return `Selamat ${pendaftar.nama}, Anda dinyatakan *DITERIMA* sebagai peserta didik di SKB Belitung.\n\nSilakan cek pengumuman resmi di halaman https://uptspnfskbbelitung/ppdb/pengumuman dengan nama terdaftar Anda.`;
    }
    return "";
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Data Pendaftar</h1>
      {/* Filter bar di bawah judul */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center mb-2">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-2 py-1 border border-gray-200">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNonApproved(1);
              setPageApproved(1);
            }}
            className="w-48 md:w-64 px-2 py-1 bg-transparent outline-none text-black placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNonApproved(1);
              setPageApproved(1);
            }}
            className="rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black font-semibold bg-white px-3 py-2 transition-all duration-150"
            style={{ color: "#222", minWidth: 110 }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / halaman
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowApproved((prev) => !prev)}
            className="rounded-lg bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition shadow-sm ml-2"
            style={{ minWidth: 180 }}
          >
            {showApproved
              ? "Sembunyikan Peserta Diterima"
              : "Lihat Peserta Diterima"}
          </button>
        </div>
      </div>

      {/* Tabel Peserta Diterima */}
      {showApproved && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-green-200">
          <div className="p-4 bg-green-50 border-b border-green-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              Peserta Diterima
            </h2>
            <span className="text-sm text-green-700">
              Total: {totalApproved}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    NISN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider relative">
                    Paket
                    <span
                      ref={packageDropdownRefApproved}
                      className="inline-block align-middle ml-2"
                    >
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-blue-100"
                        onClick={() =>
                          setShowPackageDropdownApproved((v) => !v)
                        }
                        aria-label="Filter Paket"
                      >
                        <FilterIcon />
                      </button>
                      {showPackageDropdownApproved && (
                        <div className="absolute z-10 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <button
                            className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                              selectedPackage === "all"
                                ? "font-bold text-blue-600"
                                : "text-black"
                            }`}
                            onClick={() => {
                              setSelectedPackage("all");
                              setShowPackageDropdownApproved(false);
                              setPageNonApproved(1);
                              setPageApproved(1);
                            }}
                          >
                            Semua
                          </button>
                          {PAKET_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                                selectedPackage === opt
                                  ? "font-bold text-blue-600"
                                  : "text-black"
                              }`}
                              onClick={() => {
                                setSelectedPackage(opt);
                                setShowPackageDropdownApproved(false);
                                setPageNonApproved(1);
                                setPageApproved(1);
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Tanggal Daftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedApproved.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      Tidak ada peserta diterima.
                    </td>
                  </tr>
                ) : (
                  paginatedApproved.map((item, idx) => (
                    <tr key={item._id} className="hover:bg-green-50">
                      <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-black">
                        {(pageApproved - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {item.nama}
                        </div>
                        <div className="text-sm text-black">
                          {item.namaOrtu}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                        {item.nisn ? item.nisn : "tidak ditemukan"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">{item.email}</div>
                        <div className="text-sm text-black">
                          {item.noWhatsApp}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.selectedPackage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "incomplete_docs"
                            ? "Dokumen Tidak Lengkap"
                            : item.status === "rejected"
                            ? "Ditolak"
                            : item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="hover:bg-blue-100 rounded-full p-2"
                          title="Detail"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => {
                            const msg = getWhatsAppMessage(item);
                            if (!msg) return;
                            const url = `https://wa.me/${item.noWhatsApp?.replace(
                              /\D/g,
                              ""
                            )}?text=${encodeURIComponent(msg)}`;
                            window.open(url, "_blank");
                          }}
                          className="hover:bg-green-100 rounded-full p-2"
                          title="Kirim WhatsApp"
                        >
                          <WhatsAppIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination
              page={pageApproved}
              totalPages={totalApprovedPages}
              onPageChange={(p) => setPageApproved(p)}
            />
          </div>
        </div>
      )}

      {/* Tabel Pendaftar Lainnya */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            Daftar Pendaftar
          </h2>
          <span className="text-sm text-gray-700">
            Total: {totalNonApproved}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  NISN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider relative">
                  Paket
                  <span
                    ref={packageDropdownRefNonApproved}
                    className="inline-block align-middle ml-2"
                  >
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-blue-100"
                      onClick={() =>
                        setShowPackageDropdownNonApproved((v) => !v)
                      }
                      aria-label="Filter Paket"
                    >
                      <FilterIcon />
                    </button>
                    {showPackageDropdownNonApproved && (
                      <div className="absolute z-10 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <button
                          className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                            selectedPackage === "all"
                              ? "font-bold text-blue-600"
                              : "text-black"
                          }`}
                          onClick={() => {
                            setSelectedPackage("all");
                            setShowPackageDropdownNonApproved(false);
                            setPageNonApproved(1);
                            setPageApproved(1);
                          }}
                        >
                          Semua
                        </button>
                        {PAKET_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                              selectedPackage === opt
                                ? "font-bold text-blue-600"
                                : "text-black"
                            }`}
                            onClick={() => {
                              setSelectedPackage(opt);
                              setShowPackageDropdownNonApproved(false);
                              setPageNonApproved(1);
                              setPageApproved(1);
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider relative">
                  Status
                  <span
                    ref={statusDropdownRefNonApproved}
                    className="inline-block align-middle ml-2"
                  >
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-blue-100"
                      onClick={() =>
                        setShowStatusDropdownNonApproved((v) => !v)
                      }
                      aria-label="Filter Status"
                    >
                      <FilterIcon />
                    </button>
                    {showStatusDropdownNonApproved && (
                      <div className="absolute z-10 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            className={`block w-full text-left px-4 py-2 hover:bg-blue-100 ${
                              selectedStatus === opt.value
                                ? "font-bold text-blue-600"
                                : "text-black"
                            }`}
                            onClick={() => {
                              setSelectedStatus(opt.value);
                              setShowStatusDropdownNonApproved(false);
                              setPageNonApproved(1);
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedNonApproved.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">
                    Tidak ada data pendaftar.
                  </td>
                </tr>
              ) : (
                paginatedNonApproved.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-black">
                      {(pageNonApproved - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {item.nama}
                      </div>
                      <div className="text-sm text-black">{item.namaOrtu}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                      {item.nisn ? item.nisn : "tidak ditemukan"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{item.email}</div>
                      <div className="text-sm text-black">
                        {item.noWhatsApp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.selectedPackage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status === "pending"
                          ? "Pending"
                          : item.status === "incomplete_docs"
                          ? "Dokumen Tidak Lengkap"
                          : item.status === "rejected"
                          ? "Ditolak"
                          : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="hover:bg-blue-100 rounded-full p-2"
                        title="Detail"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => {
                          const msg = getWhatsAppMessage(item);
                          if (!msg) return;
                          const url = `https://wa.me/${item.noWhatsApp?.replace(
                            /\D/g,
                            ""
                          )}?text=${encodeURIComponent(msg)}`;
                          window.open(url, "_blank");
                        }}
                        className="hover:bg-green-100 rounded-full p-2"
                        title="Kirim WhatsApp"
                      >
                        <WhatsAppIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination
            page={pageNonApproved}
            totalPages={totalNonApprovedPages}
            onPageChange={(p) => setPageNonApproved(p)}
          />
        </div>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={selectedPendaftar}
        onStatusChange={() => {
          fetchPendaftar();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
