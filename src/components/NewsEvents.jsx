import Image from "next/image";

const NewsEvents = () => {
  return (
    <section id="berita" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
            Berita & Kegiatan
          </h2>
          <p className="text-gray-600 mt-2">
            Ikuti informasi terbaru dari kami.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* News Card 1 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden group">
            <div className="w-full h-56 relative">
              <Image
                src="https://placehold.co/600x400/90CAF9/FFFFFF?text=Kegiatan+1"
                alt="Gambar Berita 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">17 Juni 2025</p>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">
                Pelaksanaan Ujian Paket C Tahun Ajaran 2024/2025
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Sebanyak 150 peserta didik mengikuti ujian akhir program
                Pendidikan Kesetaraan Paket C...
              </p>
              <a
                href="#"
                className="font-semibold text-[#2563eb] hover:text-[#1e3a8a]"
              >
                Baca Selengkapnya &rarr;
              </a>
            </div>
          </div>
          {/* News Card 2 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden group">
            <div className="w-full h-56 relative">
              <Image
                src="https://placehold.co/600x400/A5D6A7/FFFFFF?text=Kegiatan+2"
                alt="Gambar Berita 2"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">12 Juni 2025</p>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">
                Lokakarya Keterampilan Digital untuk Pemuda Belitung
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Bekerja sama dengan komunitas lokal, SKB mengadakan lokakarya
                desain grafis dasar...
              </p>
              <a
                href="#"
                className="font-semibold text-[#2563eb] hover:text-[#1e3a8a]"
              >
                Baca Selengkapnya &rarr;
              </a>
            </div>
          </div>
          {/* News Card 3 */}
          <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden group">
            <div className="w-full h-56 relative">
              <Image
                src="https://placehold.co/600x400/FFCC80/FFFFFF?text=Kegiatan+3"
                alt="Gambar Berita 3"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">5 Juni 2025</p>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">
                Peringatan Hari Lingkungan Hidup Sedunia di SKB
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Warga belajar dan tutor melaksanakan kegiatan bersih-bersih
                lingkungan dan menanam pohon...
              </p>
              <a
                href="#"
                className="font-semibold text-[#2563eb] hover:text-[#1e3a8a]"
              >
                Baca Selengkapnya &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;
