import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import PPDBForm from "@/lib/models/ppdbFormModel";

export async function GET(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get("identifier");

    if (!identifier || identifier.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter pencarian harus minimal 3 karakter",
        },
        { status: 400 }
      );
    }

    // Buat query untuk mencari berdasarkan nama atau NISN
    const query = {};
    const isNISN = /^\d+$/.test(identifier); // Cek apakah input hanya berisi angka (kemungkinan NISN)

    if (isNISN) {
      // Jika terlihat seperti NISN (hanya angka), cari berdasarkan NISN
      query.nisn = { $regex: new RegExp("^" + identifier + "$", "i") }; // exact match dengan case-insensitive
    } else {
      // Jika bukan NISN, cari berdasarkan nama (exact match)
      query.nama = { $regex: new RegExp("^" + identifier + "$", "i") }; // exact match dengan case-insensitive
    }

    // Get forms but exclude binary data to reduce response size
    const forms = await PPDBForm.find(query, {
      "aktaKelahiran.data": 0,
      "kartuKeluarga.data": 0,
      "ktp.data": 0,
      "ijazahTerakhir.data": 0,
      "suratPindah.data": 0,
    }).sort({ createdAt: -1 });

    // Transform response to include file information but not the actual binary data
    const transformedForms = forms.map((form) => {
      const formObj = form.toObject();

      // Add hasFile flags for each document
      const documentFields = [
        "aktaKelahiran",
        "kartuKeluarga",
        "ktp",
        "ijazahTerakhir",
        "suratPindah",
      ];
      documentFields.forEach((field) => {
        if (formObj[field] && formObj[field].filename) {
          formObj[field] = {
            hasFile: true,
            filename: formObj[field].filename,
            contentType: formObj[field].contentType,
            size: formObj[field].size,
            uploadDate: formObj[field].uploadDate,
          };
        } else {
          formObj[field] = { hasFile: false };
        }
      });

      return formObj;
    });

    return NextResponse.json(
      {
        success: true,
        data: transformedForms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PPDB Search Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mencari data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
