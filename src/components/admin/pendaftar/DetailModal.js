"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function DetailModal({ isOpen, onClose, data, onStatusChange }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState({});

  if (!isOpen || !data) return null;

  const requiredFields = [
    { key: "nama", label: "Nama Lengkap" },
    { key: "nisn", label: "NISN" },
    { key: "tempatLahir", label: "Tempat Lahir" },
    { key: "tanggalLahir", label: "Tanggal Lahir" },
    { key: "jenisKelamin", label: "Jenis Kelamin" },
    { key: "alamat", label: "Alamat" },
    { key: "noWhatsApp", label: "Nomor WhatsApp" },
    { key: "email", label: "Email" },
    { key: "namaOrtu", label: "Nama Orang Tua/Wali" },
    { key: "asalSekolah", label: "Asal Sekolah" },
    { key: "kelasTerakhir", label: "Kelas Terakhir" },
    { key: "selectedPackage", label: "Paket Pendidikan" },
  ];

  const requiredDocuments = [
    { key: "aktaKelahiran", label: "Akta Kelahiran" },
    { key: "kartuKeluarga", label: "Kartu Keluarga" },
    { key: "ktp", label: "KTP" },
    { key: "ijazahTerakhir", label: "Ijazah Terakhir" },
    ...(data.isTransferStudent
      ? [{ key: "suratPindah", label: "Surat Keterangan Pindah" }]
      : []),
  ];

  const isFieldEmpty = (value) => {
    return value === null || value === undefined || value === "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to view/download document
  const viewDocument = async (docKey) => {
    try {
      setLoadingFiles((prev) => ({ ...prev, [docKey]: true }));
      // Use the document viewer endpoint
      window.open(`/api/ppdb/${data._id}?file=${docKey}`, "_blank");
    } catch (error) {
      console.error(`Error viewing document ${docKey}:`, error);
      Swal.fire({
        title: "Error",
        text: `Gagal membuka dokumen. ${error.message}`,
        icon: "error",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [docKey]: false }));
    }
  };

  // PATCH status helper
  const patchStatus = async (status, statusKeterangan = "") => {
    const statusLabel =
      status === "approved"
        ? "Terima Peserta Didik"
        : status === "rejected"
        ? "Tolak Dokumen"
        : status === "incomplete_docs"
        ? "Dokumen Tidak Lengkap"
        : "Ubah Status";
    const result = await Swal.fire({
      title: `Konfirmasi ${statusLabel}`,
      text:
        status === "rejected"
          ? `Apakah Anda yakin ingin menolak dokumen peserta ini?`
          : status === "approved"
          ? `Apakah Anda yakin ingin menerima peserta didik ini?`
          : status === "incomplete_docs"
          ? `Apakah Anda yakin ingin menandai dokumen tidak lengkap?`
          : "Konfirmasi perubahan status.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ppdb/${data._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, statusKeterangan }),
      });
      const res = await response.json();
      if (res.success) {
        if (onStatusChange) onStatusChange(res.data);
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setIsSubmitting(false);
      setShowRejectModal(false);
      setShowApproveModal(false);
      setRejectReason("");
    }
  };

  // Fungsi untuk generate pesan WhatsApp sesuai status
  function getWhatsAppMessage(data) {
    if (data.status === "incomplete_docs") {
      return `Pendaftaran anda di SKB sudah masuk namun anda masih harus melengkapi dokumen yang kurang. Silakan segera lengkapi dokumen anda ke SKB.\n\nAlamat: Jl. Pendidikan No. 123, Kota\nJam Operasional: Senin - Jumat, 08:00 - 16:00`;
    } else if (data.status === "rejected") {
      return `Mohon maaf, pendaftaran anda di SKB Belitung *DITOLAK* karena dokumen yang tidak sesuai.\n\nAlasan: ${
        data.statusKeterangan || "-"
      }\n\nSilakan hubungi admin untuk informasi lebih lanjut.`;
    } else if (data.status === "approved") {
      return `Selamat ${data.nama}, Anda dinyatakan *DITERIMA* sebagai peserta didik di SKB Belitung.\n\nSilakan cek pengumuman resmi di halaman https://uptspnfskbbelitung/ppdb/pengumuman dengan nama terdaftar Anda.`;
    }
    return "";
  }
  const waUrl = (() => {
    const msg = getWhatsAppMessage(data);
    if (!msg) return null;
    return `https://wa.me/${data.noWhatsApp?.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(msg)}`;
  })();

  return (
    <>
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-white/30 z-[100]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="bg-white/95 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  {/* Status Pendaftaran - Moved to top */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                          Detail Pendaftar
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Terdaftar pada{" "}
                          {new Date(data.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          data.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : data.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : data.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {data.status === "pending"
                          ? "Pending"
                          : data.status === "approved"
                          ? "Diterima"
                          : data.status === "rejected"
                          ? "Ditolak"
                          : data.status === "incomplete_docs"
                          ? "Dokumen Tidak Lengkap"
                          : data.status}
                      </span>
                    </div>
                  </div>

                  {/* Data Pribadi */}
                  <div
                    className={`mb-6 ${
                      data.isTransferStudent ? "border-b pb-6" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 border-b-2">
                      <h4 className="text-md font-semibold text-gray-700 ">
                        {data.isTransferStudent
                          ? "Data Siswa (Siswa Mutasi)"
                          : "Data Siswa"}
                      </h4>
                      {(data.status === "incomplete_docs" ||
                        data.status === "rejected" ||
                        data.status === "approved") &&
                        waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 p-2 rounded-full hover:bg-green-100 transition cursor-pointer group"
                            title="Kirim notifikasi via WhatsApp"
                          >
                            <svg
                              className="w-5 h-5 text-green-600 group-hover:text-green-800"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.64 6.06L0 24l6.18-1.62A12.09 12.09 0 0012 24c6.63 0 12-5.37 12-12a11.93 11.93 0 00-3.48-8.52zM12 22a9.93 9.93 0 01-5.1-1.39l-.36-.21-3.67.96.98-3.58-.23-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.98 2.43.02 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                            </svg>
                          </a>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requiredFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-sm font-medium text-gray-500">
                            {field.label}
                          </label>
                          <p
                            className={`text-sm ${
                              isFieldEmpty(data[field.key])
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {isFieldEmpty(data[field.key])
                              ? "Belum diisi"
                              : field.key === "tanggalLahir"
                              ? new Date(data[field.key]).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : data[field.key]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dokumen */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">
                      Dokumen
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {requiredDocuments.map((doc) => {
                        const hasFile = data[doc.key]?.hasFile;

                        return (
                          <div
                            key={doc.key}
                            className="border rounded-lg p-3 bg-gray-50"
                          >
                            <div className="flex justify-between items-center">
                              <label className="text-sm font-medium text-gray-700">
                                {doc.label}
                              </label>
                              {hasFile ? (
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-500 mr-2">
                                    {formatFileSize(data[doc.key].size)}
                                  </span>
                                  <button
                                    onClick={() => viewDocument(doc.key)}
                                    disabled={loadingFiles[doc.key]}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded flex items-center"
                                  >
                                    {loadingFiles[doc.key] ? (
                                      <svg
                                        className="animate-spin h-4 w-4 mr-1"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                          fill="none"
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        ></path>
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        ></path>
                                      </svg>
                                    )}
                                    Lihat Dokumen
                                  </button>
                                </div>
                              ) : (
                                <span className="text-red-600 text-xs">
                                  Belum diunggah
                                </span>
                              )}
                            </div>
                            {hasFile && (
                              <p className="text-xs text-gray-500 mt-1">
                                {data[doc.key].filename} •{" "}
                                {new Date(
                                  data[doc.key].uploadDate
                                ).toLocaleDateString("id-ID")}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50/95 backdrop-blur-sm px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Tutup
              </button>
              {data.status !== "approved" && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                  >
                    Tolak Dokumen
                  </button>
                  <button
                    type="button"
                    onClick={() => patchStatus("incomplete_docs")}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:w-auto sm:text-sm"
                  >
                    Dokumen Tidak Lengkap
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApproveModal(true)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
                  >
                    Terima Peserta Didik
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tolak Dokumen */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-[201]">
            <h3 className="text-lg font-semibold mb-4">Tolak Dokumen</h3>
            <p className="mb-2 text-gray-700 text-sm">
              Tuliskan alasan penolakan dokumen untuk peserta didik{" "}
              <span className="font-bold">{data.nama}</span>:
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-red-500"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan..."
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting || !rejectReason.trim()}
                onClick={() => patchStatus("rejected", rejectReason)}
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Terima Peserta Didik */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-[201]">
            <h3 className="text-lg font-semibold mb-4">
              Konfirmasi Terima Peserta Didik
            </h3>
            <p className="mb-4 text-gray-700 text-sm">
              Apakah Anda yakin ingin menerima peserta didik{" "}
              <span className="font-bold">{data.nama}</span>?
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
              >
                Kirim WhatsApp Penerimaan
              </a>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowApproveModal(false)}
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => patchStatus("approved")}
              >
                Setuju
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
