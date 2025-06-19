import mongoose from "mongoose";

const ppdbFormSchema = new mongoose.Schema({
  // Step 1 - Personal Information
  nama: {
    type: String,
    required: [true, "Nama lengkap wajib diisi"],
    trim: true,
  },
  tempatLahir: {
    type: String,
    required: [true, "Tempat lahir wajib diisi"],
    trim: true,
  },
  tanggalLahir: {
    type: Date,
    required: [true, "Tanggal lahir wajib diisi"],
  },
  jenisKelamin: {
    type: String,
    required: [true, "Jenis kelamin wajib diisi"],
    enum: ["Laki-laki", "Perempuan"],
  },
  alamat: {
    type: String,
    required: [true, "Alamat wajib diisi"],
    trim: true,
  },
  noWhatsApp: {
    type: String,
    required: [true, "Nomor WhatsApp wajib diisi"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
    trim: true,
    lowercase: true,
  },
  namaOrtu: {
    type: String,
    required: [true, "Nama orang tua/wali wajib diisi"],
    trim: true,
  },

  // Step 2 - Educational Information
  asalSekolah: {
    type: String,
    required: [true, "Asal sekolah wajib diisi"],
    trim: true,
  },
  kelasTerakhir: {
    type: String,
    required: [true, "Kelas terakhir wajib diisi"],
    trim: true,
  },
  isTransferStudent: {
    type: Boolean,
    default: false,
  },

  // Documents
  aktaKelahiran: {
    type: String, // URL to stored file
    required: false,
  },
  kartuKeluarga: {
    type: String, // URL to stored file
    required: false,
  },
  ktp: {
    type: String, // URL to stored file
    required: false,
  },
  ijazahTerakhir: {
    type: String, // URL to stored file
    required: false,
  },
  suratPindah: {
    type: String, // URL to stored file
    required: false,
  },

  // Package Selection
  selectedPackage: {
    type: String,
    required: [true, "Paket pendidikan wajib dipilih"],
    enum: ["PAKET A", "PAKET B", "PAKET C"],
  },

  // Status
  status: {
    type: String,
    enum: ["pending", "incomplete_docs", "rejected", "approved"],
    default: "pending",
  },
  statusKeterangan: {
    type: String,
    default: "",
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
ppdbFormSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create model if it doesn't exist, otherwise use existing model
const PPDBForm =
  mongoose.models.PPDBForm || mongoose.model("PPDBForm", ppdbFormSchema);

export default PPDBForm;
