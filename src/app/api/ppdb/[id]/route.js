import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import PPDBForm from "@/lib/models/ppdbFormModel";

export async function GET(request, { params }) {
  try {
    await ConnectDB();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file");
    const download = searchParams.get("download");

    if (file) {
      // Handle file download/view
      const form = await PPDBForm.findById(id);
      if (!form) {
        return NextResponse.json(
          { success: false, message: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      // Check if file exists and has data
      if (!form[file] || !form[file].filename || !form[file].data) {
        return NextResponse.json(
          { success: false, message: "File tidak ditemukan" },
          { status: 404 }
        );
      }

      // If download parameter is true, return the actual file binary
      if (download === "true") {
        return new NextResponse(form[file].data, {
          headers: {
            "Content-Type": form[file].contentType,
            "Content-Disposition": `inline; filename="${form[file].filename}"`,
          },
        });
      }

      // Return file metadata for viewing
      return NextResponse.json({
        success: true,
        data: {
          filename: form[file].filename,
          contentType: form[file].contentType,
          size: form[file].size,
          uploadDate: form[file].uploadDate,
          hasFile: true,
        },
      });
    }

    // Return form data
    const form = await PPDBForm.findById(id);
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Transform response to include file information but not the actual binary data
    const formObj = form.toObject();

    // Add hasFile flags for each document
    const documentFields = [
      "aktaKelahiran",
      "kartuKeluarga",
      "ktp",
      "ijazahTerakhir",
      "suratPindah",
      "rapot",
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

    return NextResponse.json({
      success: true,
      data: formObj,
    });
  } catch (error) {
    console.error("Error fetching PPDB form:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await ConnectDB();
    const { id } = params;

    // Find and delete the PPDB form
    const deletedForm = await PPDBForm.findByIdAndDelete(id);

    if (!deletedForm) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil dihapus",
      data: {
        _id: deletedForm._id,
        nama: deletedForm.nama,
      },
    });
  } catch (error) {
    console.error("Error deleting PPDB form:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await ConnectDB();
    const { id } = params;

    // Check if request is multipart/form-data (file upload)
    const contentType = request.headers.get("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();
      const updateData = {};

      // Process text fields
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          updateData[key] = value;
        }
      }

      // Process files
      const fileFields = [
        "aktaKelahiran",
        "kartuKeluarga",
        "ktp",
        "ijazahTerakhir",
        "suratPindah",
        "rapot",
      ];

      for (const field of fileFields) {
        const file = formData.get(field);
        if (file && file instanceof File) {
          // Convert file to buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          updateData[field] = {
            data: buffer,
            filename: file.name,
            contentType: file.type,
            size: file.size,
            uploadDate: new Date(),
            hasFile: true,
          };
        }
      }

      // Find and update the PPDB form
      const updatedForm = await PPDBForm.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedForm) {
        return NextResponse.json(
          { success: false, message: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Data berhasil diperbarui",
        data: updatedForm,
      });
    } else {
      // Handle JSON data (status updates)
      const body = await request.json();

      // Find and update the PPDB form
      const updatedForm = await PPDBForm.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true }
      );

      if (!updatedForm) {
        return NextResponse.json(
          { success: false, message: "Data tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Data berhasil diperbarui",
        data: updatedForm,
      });
    }
  } catch (error) {
    console.error("Error updating PPDB form:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data" },
      { status: 500 }
    );
  }
}
