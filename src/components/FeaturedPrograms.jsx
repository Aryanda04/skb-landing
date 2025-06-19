const FeaturedPrograms = () => {
  return (
    <section id="program" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
            Program Unggulan
          </h2>
          <p className="text-gray-600 mt-2">
            Pilih program yang sesuai untuk masa depan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Program Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-5xl text-[#3b82f6] mb-4">
              <i className="fas fa-book-open-reader"></i>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
              Pendidikan Kesetaraan
            </h3>
            <p className="text-gray-600 text-sm">
              Program Paket A (setara SD), Paket B (setara SMP), dan Paket C
              (setara SMA) untuk masa depan yang lebih cerah.
            </p>
          </div>
          {/* Program Card 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-5xl text-[#3b82f6] mb-4">
              <i className="fas fa-cut"></i>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
              Kursus Keterampilan
            </h3>
            <p className="text-gray-600 text-sm">
              Berbagai kursus seperti Menjahit, Tata Rias, Komputer, dan lainnya
              untuk meningkatkan keahlian kerja.
            </p>
          </div>
          {/* Program Card 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-5xl text-[#3b82f6] mb-4">
              <i className="fas fa-book"></i>
            </div>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
              Taman Bacaan Masyarakat
            </h3>
            <p className="text-gray-600 text-sm">
              Pusat informasi dan rekreasi literasi dengan ruang nyaman, koleksi
              buku lengkap, dan Wi-Fi gratis. Tersedia juga kegiatan diskusi,
              pelatihan, dan lomba literasi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
