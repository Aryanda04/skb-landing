import { NextResponse } from "next/server";
import mongoose from "mongoose";
import PesertaDaftarUlang from "@/lib/models/pesertaDaftarUlangModel";
import { ConnectDB } from "@/lib/config/db";

// Ensure correct collection name
if (
  mongoose.models.PesertaDaftarUlang?.collection?.collectionName !==
  "pesertadaftarulangs"
) {
  mongoose.deleteModel("PesertaDaftarUlang");
}

export const POST = async (req) => {
  await ConnectDB();
  try {
    const formData = await req.formData();
    const nama = formData.get("nama");
    const noHp = formData.get("noHp");
    const kelasTerakhir = formData.get("kelasTerakhir");
    const file = formData.get("fotoRaport");

    if (!nama || !noHp || !kelasTerakhir || !file) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to DB
    const peserta = new PesertaDaftarUlang({
      nama,
      noHp,
      kelasTerakhir,
      fotoRaport: {
        filename: file.name,
        contentType: file.type,
        data: buffer,
        size: file.size,
        uploadDate: new Date(),
      },
    });
    await peserta.save();
    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  await ConnectDB();
  try {
    const data = await PesertaDaftarUlang.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  await ConnectDB();
  try {
    let id;
    if (req.method === "DELETE") {
      // Next.js 13+ fetch: id can be in query or body
      const url = new URL(req.url);
      id = url.searchParams.get("id");
      if (!id) {
        const body = await req.json().catch(() => null);
        id = body?.id;
      }
    }
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID tidak ditemukan." },
        { status: 400 }
      );
    }
    const deleted = await PesertaDaftarUlang.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Data berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
