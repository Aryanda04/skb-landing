import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import PPDBForm from "@/lib/models/ppdbFormModel";

export async function PATCH(request, { params }) {
  try {
    await ConnectDB();
    const { id } = params;
    const body = await request.json();
    const { status, statusKeterangan } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status wajib diisi" },
        { status: 400 }
      );
    }

    const updateData = { status };
    if (typeof statusKeterangan === "string") {
      updateData.statusKeterangan = statusKeterangan;
    }

    const updated = await PPDBForm.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
