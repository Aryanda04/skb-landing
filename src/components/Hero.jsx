import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with Tailwind gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-start px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl">
          <div className="mb-2 inline-block rounded-full bg-blue-500 bg-opacity-30 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            Pendidikan Non Formal
          </div>

          <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            <span className="text-yellow-400">UPT SPNF</span> SKB Belitung
          </h1>

          <h2 className="mb-6 text-2xl font-medium text-white md:text-3xl">
            Sanggar Kegiatan Belajar Kabupaten Belitung
          </h2>

          <p className="mb-8 text-lg text-gray-200 max-w-2xl">
            Mewujudkan masyarakat yang cerdas, terampil, dan berakhlak mulia
            melalui layanan pendidikan nonformal yang berkualitas
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="#program"
              className="rounded-full bg-[#2563eb] px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Program Kami
            </Link>
            <Link
              href="/ppdb"
              className="rounded-full bg-white px-6 py-3 font-semibold text-[#1e3a8a] transition-all hover:bg-gray-100 hover:shadow-lg"
            >
              Pendaftaran PPDB
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            <div className="rounded-lg bg-white bg-opacity-10 backdrop-blur-sm p-4 text-center">
              <p className="text-3xl font-bold text-white">10+</p>
              <p className="text-sm text-gray-300">Program Aktif</p>
            </div>
            <div className="rounded-lg bg-white bg-opacity-10 backdrop-blur-sm p-4 text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-gray-300">Warga Belajar</p>
            </div>
            <div className="rounded-lg bg-white bg-opacity-10 backdrop-blur-sm p-4 text-center">
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="text-sm text-gray-300">Tutor Berpengalaman</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full text-white"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Animated Circles */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-yellow-500 rounded-full opacity-20 animate-pulse"></div>
      <div
        className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-10 w-24 h-24 bg-indigo-500 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default Hero;
