import mongoose from "mongoose";

const ppdbFormSchema = new mongoose.Schema({
  // Step 1 - Personal Information
  nama: {
    type: String,
    required: [true, "Nama lengkap wajib diisi"],
    trim: true,
  },
  nisn: {
    type: String,
    trim: true,
    index: true,
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

  // Documents as Binary Storage
  aktaKelahiran: {
    filename: String,
    contentType: String,
    data: Buffer,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  kartuKeluarga: {
    filename: String,
    contentType: String,
    data: Buffer,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  ktp: {
    filename: String,
    contentType: String,
    data: Buffer,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  ijazahTerakhir: {
    filename: String,
    contentType: String,
    data: Buffer,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  suratPindah: {
    filename: String,
    contentType: String,
    data: Buffer,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
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
