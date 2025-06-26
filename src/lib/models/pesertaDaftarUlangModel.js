import mongoose from "mongoose";

const pesertaDaftarUlangSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    noHp: { type: String, required: true },
    kelasTerakhir: { type: String, required: true },
    fotoRaport: {
      type: {
        filename: String,
        contentType: String,
        data: Buffer,
        size: Number,
        uploadDate: { type: Date, default: Date.now },
      },
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "pesertadaftarulangs" }
);

export default mongoose.models.PesertaDaftarUlang ||
  mongoose.model("PesertaDaftarUlang", pesertaDaftarUlangSchema);
