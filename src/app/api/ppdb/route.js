import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import PPDBForm from "@/lib/models/ppdbFormModel";

export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.json();

    // Create new PPDB form entry
    const ppdbForm = new PPDBForm({
      ...formData,
      isTransferStudent: formData.isTransferStudent || false,
      status: "pending",
    });

    // Save to database
    await ppdbForm.save();

    return NextResponse.json(
      {
        success: true,
        message: "Formulir PPDB berhasil disimpan",
        data: ppdbForm,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PPDB Form Submission Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menyimpan formulir",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const noWhatsApp = searchParams.get("noWhatsApp");

    let query = {};
    if (email) {
      query.email = email;
    }
    if (noWhatsApp) {
      query.noWhatsApp = noWhatsApp;
    }

    const forms = await PPDBForm.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: forms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PPDB Form Fetch Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data formulir",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
