import React from "react";
import Swal from "sweetalert2";

export default function DaftarUlangTable({ daftarUlang, isLoading, onDelete }) {
  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus data peserta daftar ulang \"${item.nama}\"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/daftar-ulang?id=${item._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Berhasil", "Data berhasil dihapus.", "success");
          if (onDelete) onDelete();
        } else {
          Swal.fire("Gagal", data.message || "Gagal menghapus data.", "error");
        }
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-blue-200">
      <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
          Daftar Ulang
        </h2>
        <span className="text-sm text-blue-700">
          Total: {daftarUlang.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                No Hp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Kelas Terakhir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Tanggal Daftar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Memuat data...
                </td>
              </tr>
            ) : daftarUlang.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Tidak ada data daftar ulang.
                </td>
              </tr>
            ) : (
              daftarUlang.map((item, idx) => (
                <tr key={item._id} className="hover:bg-blue-50">
                  <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-black">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {item.noHp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {item.kelasTerakhir}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 items-center">
                    {item.fotoRaport && (
                      <button
                        onClick={() => {
                          const blob = new Blob(
                            [new Uint8Array(item.fotoRaport.data.data)],
                            { type: item.fotoRaport.contentType }
                          );
                          const url = URL.createObjectURL(blob);
                          window.open(url, "_blank");
                        }}
                        className="hover:bg-blue-100 rounded-full p-2"
                        title="Lihat/Download File"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 7V3a1 1 0 011-1h6a1 1 0 011 1v4"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item)}
                      className="hover:bg-red-100 rounded-full p-2"
                      title="Hapus"
                    >
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
