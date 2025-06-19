import Image from "next/image";

const AboutUs = () => {
  return (
    <section id="tentang" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
            Tentang Kami
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            Mengenal lebih dekat UPT SPNF SKB Belitung.
          </p>

          {/* Statistik */}
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <p className="text-4xl font-bold text-[#2563eb] mb-2">10+</p>
              <p className="text-gray-600 text-lg font-medium">Program Aktif</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <p className="text-4xl font-bold text-[#2563eb] mb-2">500+</p>
              <p className="text-gray-600 text-lg font-medium">Warga Belajar</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <p className="text-4xl font-bold text-[#2563eb] mb-2">20+</p>
              <p className="text-gray-600 text-lg font-medium">
                Tutor Berpengalaman
              </p>
            </div>
          </div>
        </div>

        {/* Informasi Tentang SKB */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="md:w-1/2">
            <Image
              src="/skbbelitung.jpg"
              alt="Gedung UPT SPNF SKB Belitung"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-700 leading-relaxed mb-6">
              Unit Pelaksana Teknis Satuan Pendidikan Non Formal (UPT SPNF)
              Sanggar Kegiatan Belajar (SKB) Kabupaten Belitung. Kami adalah
              lembaga pemerintah di bawah naungan Dinas Pendidikan dan
              Kebudayaan Kabupaten Belitung yang berdedikasi penuh pada
              penyelenggaraan pendidikan nonformal dan informal.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sebagai bukti komitmen kami terhadap kualitas, UPT SPNF SKB
              Belitung telah meraih Akreditasi B dari Badan Akreditasi Nasional
              Pendidikan Anak Usia Dini dan Pendidikan Non Formal (BAN PAUD dan
              PNF).
            </p>

            <div className="p-5 rounded-lg mb-6">
              <h3 className="font-bold text-xl text-[#1e3a8a] mb-2">
                Visi Kami
              </h3>
              <p className="text-gray-700 mb-4">
                Mewujudkan Masyarakat Cerdas, Terampil dan Berakhlak Mulia
                Melalui Pendidikan Non Formal.
              </p>

              <h3 className="font-bold text-xl text-[#1e3a8a] mb-2">
                Misi Kami
              </h3>
              <p className="text-gray-700 mb-2">
                Untuk mencapai visi tersebut, kami menjalankan beberapa misi
                utama:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Meningkatkan Ketaqwaan Melalui Kegiatan Keagamaan</li>
                <li>Mewujudkan Pendidikan yang Bermutu, Efisien dan Relevan</li>
                <li>
                  Mempersiapkan peserta didik agar dapat berdaya saing di
                  lingkungan masyarakat
                </li>
                <li>
                  Mempersiapkan peserta didik untuk melanjutkan pendidikan ke
                  jenjang yang lebih tinggi
                </li>
                <li>
                  Mempersiapkan peserta didik masuk ke dunia kerja dengan
                  memberikan keterampilan bersifat soft skill dan keterampilan
                  vokasi
                </li>
                <li>
                  Membudayakan peserta didik menggunakan teknologi informasi dan
                  komunikasi dalam kegiatan pembelajaran
                </li>
                <li>
                  Mewujudkan lingkungan SPNF SKB Belitung yang bersih, asri, dan
                  nyaman
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sambutan Kepala Sekolah */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1e3a8a]">
            Sambutan Kepala Sekolah
          </h2>
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/3">
              <div className="w-64 h-64 relative rounded-full overflow-hidden mx-auto">
                <Image
                  src="/kepala-sekolah.jpeg"
                  alt="Kepala Sekolah"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mt-6 mb-2 text-[#1e3a8a] text-center">
                Yayan Afrianti S.Mn
              </h3>
              <p className="text-gray-500 text-center">
                PLT Kepala UPT SPNF SKB Belitung
              </p>
            </div>
            <div className="md:w-2/3">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  Assalamualaikum Warahmatullahi Wabarakatuh,
                </p>
                <p className="text-gray-600 mb-4">
                  Selamat datang di SPNF SKB Belitung. Kami hadir sebagai
                  jembatan pendidikan bagi seluruh masyarakat, terutama bagi
                  mereka yang perjalanannya di sekolah formal terputus. Kami
                  percaya bahwa setiap individu berhak mendapatkan kesempatan
                  untuk belajar, bertumbuh, dan mempersiapkan diri agar dapat
                  berdaya saing di lingkungan masyarakat.
                </p>
                <p className="text-gray-600 mb-4">
                  Melalui program Pendidikan Kesetaraan Paket A, B, dan C, kami
                  secara nyata mendukung upaya pemerintah daerah untuk
                  memastikan setiap anak usia sekolah memiliki tempat untuk
                  belajar. Ini adalah kontribusi kami dalam menjaga dan
                  meningkatkan Angka Partisipasi Sekolah (APS) di Kabupaten
                  Belitung, demi mewujudkan masyarakat yang cerdas, terampil,
                  dan berakhlak mulia.
                </p>
                <p className="text-gray-600 mb-4">
                  Wassalamualaikum Warahmatullahi Wabarakatuh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
