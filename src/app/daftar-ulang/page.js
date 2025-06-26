import DaftarUlangForm from "../../components/ppdb/DaftarUlangForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DaftarUlangPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar forceScrolled={true} />
      <main className="flex-grow bg-gray-50 pt-42 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Daftar Ulang untuk warga belajar SKB Belitung
            </h1>
            <p className="text-gray-600 mb-6">
              Silakan isi formulir daftar ulang di bawah ini.
            </p>
          </div>
          <DaftarUlangForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
