import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import PPDBForm from "@/lib/models/ppdbFormModel";

export async function POST(request) {
  try {
    await ConnectDB();

    // Handle multipart form data
    const formData = await request.formData();

    // Mengambil data form
    const formEntries = {};

    // Log untuk debugging
    console.log("Data yang diterima dari form:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? "File" : value}`);
    }

    // Process form fields
    for (const [key, value] of formData.entries()) {
      // Check if the value is a file
      if (value instanceof File) {
        // Handle file
        const fileBuffer = await value.arrayBuffer();
        formEntries[key] = {
          filename: value.name,
          contentType: value.type,
          data: Buffer.from(fileBuffer),
          size: value.size,
          uploadDate: new Date(),
        };
      } else {
        // Handle regular form fields
        formEntries[key] = value;
      }
    }

    // Convert string 'true'/'false' to boolean for isTransferStudent
    if (formEntries.isTransferStudent) {
      formEntries.isTransferStudent = formEntries.isTransferStudent === "true";
    }

    // Pastikan NISN disimpan
    if (!formEntries.nisn) {
      formEntries.nisn = "";
    }

    // Log data yang akan disimpan
    console.log("Data yang akan disimpan ke database:", {
      ...formEntries,
      nisn: formEntries.nisn,
      // Tidak menampilkan file data binary yang besar
      aktaKelahiran: formEntries.aktaKelahiran ? "File tersedia" : undefined,
      kartuKeluarga: formEntries.kartuKeluarga ? "File tersedia" : undefined,
      ktp: formEntries.ktp ? "File tersedia" : undefined,
      ijazahTerakhir: formEntries.ijazahTerakhir ? "File tersedia" : undefined,
      suratPindah: formEntries.suratPindah ? "File tersedia" : undefined,
      rapot: formEntries.rapot ? "File tersedia" : undefined,
    });

    // Create new PPDB form entry
    const ppdbForm = new PPDBForm({
      ...formEntries,
      status: "pending",
    });

    // Save to database
    await ppdbForm.save();

    return NextResponse.json(
      {
        success: true,
        message: "Formulir PPDB berhasil disimpan",
        data: {
          _id: ppdbForm._id,
          nama: ppdbForm.nama,
          email: ppdbForm.email,
          nisn: ppdbForm.nisn,
          status: ppdbForm.status,
        },
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
    const nama = searchParams.get("nama");

    let query = {};
    if (email) {
      query.email = email;
    }
    if (noWhatsApp) {
      query.noWhatsApp = noWhatsApp;
    }
    if (nama) {
      query.nama = { $regex: nama, $options: "i" }; // Case-insensitive search
    }

    // Get forms but exclude binary data to reduce response size
    const forms = await PPDBForm.find(query, {
      "aktaKelahiran.data": 0,
      "kartuKeluarga.data": 0,
      "ktp.data": 0,
      "ijazahTerakhir.data": 0,
      "suratPindah.data": 0,
      "rapot.data": 0,
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

// Endpoint to download a file from a specific form
export async function PATCH(request) {
  try {
    await ConnectDB();

    const formData = await request.json();
    const { id } = formData;

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
