This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Situs Web SKB Belitung

Situs web resmi untuk UPT SPNF SKB Belitung.

## Fitur Upload File BSON ke MongoDB

Sistem ini mendukung upload file langsung ke MongoDB dalam format BSON, dengan ketentuan:

1. **Batas ukuran file**: Maksimal 12MB per file
2. **Format file yang didukung**: PDF
3. **Dokumen yang dapat diupload**:
   - Akta Kelahiran
   - Kartu Keluarga
   - KTP
   - Ijazah Terakhir
   - Surat Keterangan Pindah (untuk siswa mutasi)

### Cara Kerja

1. File diunggah melalui `FormData` di sisi klien
2. File diubah menjadi `Buffer` dan disimpan dalam database bersama metadata (nama file, tipe konten, ukuran, dll)
3. API endpoint khusus digunakan untuk mengambil file dari database
4. Admin dapat melihat dan mendownload file langsung dari panel admin

### Endpoints API

- `POST /api/ppdb` - Mendaftarkan peserta baru dengan file dokumen
- `GET /api/ppdb` - Mendapatkan daftar semua peserta (tanpa binary data)
- `GET /api/ppdb/[id]` - Mendapatkan detail peserta (tanpa binary data)
- `GET /api/ppdb/[id]?file=namaFile` - Mendownload file dokumen tertentu
- `PATCH /api/ppdb/[id]` - Memperbarui status peserta

## Teknologi

- Next.js
- MongoDB
- TailwindCSS
