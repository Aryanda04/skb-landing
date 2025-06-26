"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB

const DaftarUlangForm = () => {
  const [form, setForm] = useState({
    nama: "",
    noHp: "",
    kelasTerakhir: "",
    fotoRaport: null,
  });
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran file maksimal 12MB");
      setForm({ ...form, fotoRaport: null });
      setFileName("");
      setFilePreview(null);
      return;
    }
    setFileError(null);
    setFileName(file.name);
    setForm({ ...form, fotoRaport: file });
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleFileDelete = () => {
    setForm({ ...form, fotoRaport: null });
    setFileName("");
    setFilePreview(null);
    setFileError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.fotoRaport) {
      setFileError("File raport wajib diupload");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nama", form.nama);
      formData.append("noHp", form.noHp);
      formData.append("kelasTerakhir", form.kelasTerakhir);
      formData.append("fotoRaport", form.fotoRaport);

      const res = await fetch("/api/daftar-ulang", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Formulir berhasil dikirim!");
        setForm({ nama: "", noHp: "", kelasTerakhir: "", fotoRaport: null });
        setFileName("");
        setFilePreview(null);
      } else {
        setError(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg space-y-8"
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black"
            placeholder="Masukkan nama lengkap"
          />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            No Hp <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center">
            <span className="inline-block px-4 py-3 border border-r-0 rounded-l-lg bg-gray-100 text-gray-700 text-lg">
              +62
            </span>
            <input
              type="tel"
              name="noHp"
              value={form.noHp}
              onChange={handleChange}
              required
              pattern="8[0-9]{7,12}"
              className="w-full border text-gray-700 rounded-r-lg px-4 py-3 text-lg focus:border-blue-500 focus:ring-blue-500"
              placeholder="8xxxxxxxxx"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Contoh: 81234567890</p>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Kelas Terakhir <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="kelasTerakhir"
            value={form.kelasTerakhir}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black"
            placeholder="Contoh: VII, VIII, IX, X, XI, XII"
          />
        </div>
        <div className="relative">
          <label className="block text-base font-medium text-gray-700 mb-2">
            Foto Raport (tahun ajaran sebelumnya){" "}
            <span className="text-red-600">*</span>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
            <div className="space-y-1 text-center w-full">
              {form.fotoRaport ? (
                <div className="relative">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600 truncate max-w-[80%]">
                      {fileName}
                    </span>
                    <button
                      type="button"
                      onClick={handleFileDelete}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  {filePreview && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="mt-2 h-32 object-contain border rounded-lg mx-auto"
                    />
                  )}
                  {!filePreview && fileName.endsWith(".pdf") && (
                    <div className="mt-2 text-xs text-gray-500">
                      File PDF terpilih
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload file</span>
                      <input
                        type="file"
                        name="fotoRaport"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF atau gambar, maksimal 12MB
                  </p>
                </>
              )}
              {fileError && (
                <p className="text-sm text-red-600 mt-1">{fileError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-600 font-semibold text-center">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Daftar Ulang"}
      </button>
    </form>
  );
};

export default DaftarUlangForm;
