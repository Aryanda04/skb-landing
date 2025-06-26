"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function DetailModalEdit({
  isOpen,
  onClose,
  data,
  onStatusChange,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({});
  const [loadingFiles, setLoadingFiles] = useState({});
  const [isTransferStudent, setIsTransferStudent] = useState(false);

  if (!isOpen || !data) return null;

  // Fungsi untuk melihat dokumen
  const viewDocument = async (docKey) => {
    try {
      setLoadingFiles((prev) => ({ ...prev, [docKey]: true }));
      window.open(
        `/api/ppdb/${data._id}?file=${docKey}&download=true`,
        "_blank"
      );
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Gagal membuka dokumen. ${error.message}`,
        icon: "error",
      });
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [docKey]: false }));
    }
  };

  // Handle edit data
  const handleEditData = () => {
    setEditData({
      nama: data.nama || "",
      nisn: data.nisn || "",
      tempatLahir: data.tempatLahir || "",
      tanggalLahir: data.tanggalLahir ? data.tanggalLahir.split("T")[0] : "",
      jenisKelamin: data.jenisKelamin || "",
      alamat: data.alamat || "",
      noWhatsApp: data.noWhatsApp || "",
      email: data.email || "",
      namaOrtu: data.namaOrtu || "",
      asalSekolah: data.asalSekolah || "",
      kelasTerakhir: data.kelasTerakhir || "",
      selectedPackage: data.selectedPackage || "",
    });
    // Set transfer student status from data
    setIsTransferStudent(data.isTransferStudent || false);
  };

  // Handle transfer student toggle
  const handleTransferStudentToggle = () => {
    const newIsTransferStudent = !isTransferStudent;
    setIsTransferStudent(newIsTransferStudent);

    // Clear transfer student specific fields when switching to non-transfer student
    if (!newIsTransferStudent) {
      setEditData((prev) => ({
        ...prev,
        kelasTerakhir: "",
        suratPindah: null,
        rapot: null,
      }));
    }
  };

  // Save edited data
  const saveEditData = async () => {
    setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add text fields
      Object.keys(editData).forEach((key) => {
        if (
          typeof editData[key] === "string" ||
          typeof editData[key] === "number"
        ) {
          // Only include kelasTerakhir if it's a transfer student
          if (key === "kelasTerakhir") {
            if (isTransferStudent && editData[key].trim() !== "") {
              formData.append(key, editData[key]);
            }
          } else {
            formData.append(key, editData[key]);
          }
        }
      });

      // Add files if they exist
      const fileFields = [
        "aktaKelahiran",
        "kartuKeluarga",
        "ktp",
        "ijazahTerakhir",
      ];

      // Add transfer student specific files only if isTransferStudent is true
      if (isTransferStudent) {
        fileFields.push("suratPindah", "rapot");
      }

      fileFields.forEach((field) => {
        if (editData[field] && editData[field] instanceof File) {
          formData.append(field, editData[field]);
        }
      });

      // Add isTransferStudent status
      formData.append("isTransferStudent", isTransferStudent);

      const response = await fetch(`/api/ppdb/${data._id}`, {
        method: "PATCH",
        body: formData, // Use FormData instead of JSON
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil diperbarui",
          icon: "success",
        });

        if (onStatusChange) {
          onStatusChange(result.data);
        }

        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Gagal memperbarui data: ${error.message}`,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize edit data when modal opens
  if (isOpen && Object.keys(editData).length === 0) {
    handleEditData();
  }

  return (
    <>
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-white/30 z-[200]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg text-black font-semibold mb-4">
            Edit Data Peserta
          </h3>

          {/* Data Pribadi */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-b-2 pb-2">
              Data Pribadi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editData.nama || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, nama: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  NISN
                </label>
                <input
                  type="text"
                  value={editData.nisn || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, nisn: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan NISN"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  value={editData.tempatLahir || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, tempatLahir: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan tempat lahir"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={editData.tanggalLahir || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, tanggalLahir: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Jenis Kelamin
                </label>
                <select
                  value={editData.jenisKelamin || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, jenisKelamin: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <input
                  type="text"
                  value={editData.alamat || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, alamat: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan alamat"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={editData.noWhatsApp || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, noWhatsApp: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan nomor WhatsApp"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan email"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Nama Orang Tua/Wali
                </label>
                <input
                  type="text"
                  value={editData.namaOrtu || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, namaOrtu: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan nama orang tua/wali"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={editData.asalSekolah || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, asalSekolah: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Masukkan asal sekolah"
                />
              </div>

              {isTransferStudent && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Kelas Terakhir
                  </label>
                  <input
                    type="text"
                    value={editData.kelasTerakhir || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        kelasTerakhir: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Masukkan kelas terakhir"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Paket Pendidikan
                </label>
                <select
                  value={editData.selectedPackage || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      selectedPackage: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Pilih Paket</option>
                  <option value="PAKET A">PAKET A</option>
                  <option value="PAKET B">PAKET B</option>
                  <option value="PAKET C">PAKET C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Peserta Didik */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-b-2 pb-2">
              Status Peserta Didik
            </h4>
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleTransferStudentToggle}
                className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                    isTransferStudent ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
              <p className="ml-3 text-base font-medium text-gray-900">
                {isTransferStudent
                  ? "Peserta Didik Mutasi/Pindahan"
                  : "Peserta Didik Baru"}
              </p>
            </div>
          </div>

          {/* Dokumen */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-3 border-b-2 pb-2">
              Dokumen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Akta Kelahiran
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditData({
                        ...editData,
                        aktaKelahiran: file,
                      });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                />
                {data.aktaKelahiran?.hasFile && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>File saat ini: {data.aktaKelahiran.filename}</span>
                    <button
                      type="button"
                      onClick={() => viewDocument("aktaKelahiran")}
                      disabled={loadingFiles["aktaKelahiran"]}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      {loadingFiles["aktaKelahiran"]
                        ? "Membuka..."
                        : "Lihat Dokumen"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Kartu Keluarga
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditData({
                        ...editData,
                        kartuKeluarga: file,
                      });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                />
                {data.kartuKeluarga?.hasFile && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>File saat ini: {data.kartuKeluarga.filename}</span>
                    <button
                      type="button"
                      onClick={() => viewDocument("kartuKeluarga")}
                      disabled={loadingFiles["kartuKeluarga"]}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      {loadingFiles["kartuKeluarga"]
                        ? "Membuka..."
                        : "Lihat Dokumen"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">KTP</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditData({
                        ...editData,
                        ktp: file,
                      });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                />
                {data.ktp?.hasFile && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>File saat ini: {data.ktp.filename}</span>
                    <button
                      type="button"
                      onClick={() => viewDocument("ktp")}
                      disabled={loadingFiles["ktp"]}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      {loadingFiles["ktp"] ? "Membuka..." : "Lihat Dokumen"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Ijazah Terakhir
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditData({
                        ...editData,
                        ijazahTerakhir: file,
                      });
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                />
                {data.ijazahTerakhir?.hasFile && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>File saat ini: {data.ijazahTerakhir.filename}</span>
                    <button
                      type="button"
                      onClick={() => viewDocument("ijazahTerakhir")}
                      disabled={loadingFiles["ijazahTerakhir"]}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      {loadingFiles["ijazahTerakhir"]
                        ? "Membuka..."
                        : "Lihat Dokumen"}
                    </button>
                  </div>
                )}
              </div>

              {isTransferStudent && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Surat Keterangan Pindah
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditData({
                          ...editData,
                          suratPindah: file,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  {data.suratPindah?.hasFile && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>File saat ini: {data.suratPindah.filename}</span>
                      <button
                        type="button"
                        onClick={() => viewDocument("suratPindah")}
                        disabled={loadingFiles["suratPindah"]}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                      >
                        {loadingFiles["suratPindah"]
                          ? "Membuka..."
                          : "Lihat Dokumen"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isTransferStudent && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Rapot
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditData({
                          ...editData,
                          rapot: file,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  {data.rapot?.hasFile && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>File saat ini: {data.rapot.filename}</span>
                      <button
                        type="button"
                        onClick={() => viewDocument("rapot")}
                        disabled={loadingFiles["rapot"]}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                      >
                        {loadingFiles["rapot"] ? "Membuka..." : "Lihat Dokumen"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={saveEditData}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
