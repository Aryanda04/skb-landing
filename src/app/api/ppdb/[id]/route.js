import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import PPDBForm from "@/lib/models/ppdbFormModel";

export async function GET(request, { params }) {
  try {
    await ConnectDB();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get("file");

    // Validate if fileType is valid
    const validFileTypes = [
      "aktaKelahiran",
      "kartuKeluarga",
      "ktp",
      "ijazahTerakhir",
      "suratPindah",
    ];
    if (fileType && !validFileTypes.includes(fileType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Jenis file tidak valid",
        },
        { status: 400 }
      );
    }

    // Find the form by ID
    const form = await PPDBForm.findById(id);

    if (!form) {
      return NextResponse.json(
        {
          success: false,
          message: "Formulir tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // If fileType parameter is present, return the file
    if (fileType) {
      const file = form[fileType];

      if (!file || !file.data) {
        return NextResponse.json(
          {
            success: false,
            message: "File tidak ditemukan",
          },
          { status: 404 }
        );
      }

      // Return file as binary data
      return new NextResponse(file.data, {
        headers: {
          "Content-Type": file.contentType || "application/pdf",
          "Content-Disposition": `inline; filename="${file.filename}"`,
        },
      });
    }

    // Otherwise return the form data (excluding binary data)
    const formObj = form.toObject();

    // Remove binary data from response
    const documentFields = [
      "aktaKelahiran",
      "kartuKeluarga",
      "ktp",
      "ijazahTerakhir",
      "suratPindah",
    ];
    documentFields.forEach((field) => {
      if (formObj[field] && formObj[field].data) {
        // Replace binary data with metadata only
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

    return NextResponse.json(
      {
        success: true,
        data: formObj,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PPDB Form Detail Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil detail formulir",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await ConnectDB();

    const { id } = params;
    const formData = await request.json();

    // Find the form by ID
    const form = await PPDBForm.findById(id);

    if (!form) {
      return NextResponse.json(
        {
          success: false,
          message: "Formulir tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Update status and other fields
    if (formData.status) {
      form.status = formData.status;
    }

    if (formData.statusKeterangan) {
      form.statusKeterangan = formData.statusKeterangan;
    }

    // Save the updated form
    await form.save();

    return NextResponse.json(
      {
        success: true,
        message: "Status formulir berhasil diperbarui",
        data: form,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PPDB Form Update Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memperbarui status formulir",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
