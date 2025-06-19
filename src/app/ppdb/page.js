"use client";

import { useState } from "react";
import RegistrationSteps from "@/components/ppdb/RegistrationSteps";
import RegistrationForm from "@/components/ppdb/RegistrationForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PPDBPage() {
  const [selectedPackage, setSelectedPackage] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar forceScrolled={true} />

      <main className="flex-grow bg-gray-50 pt-42 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Penerimaan Peserta Didik Baru (PPDB)
            </h1>
            <p className="text-lg text-gray-600">
              Selamat datang di halaman pendaftaran PPDB. Silakan ikuti
              langkah-langkah pendaftaran di bawah ini.
            </p>
          </div>

          <div className="space-y-8">
            {/* Registration Steps - Full Width */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <RegistrationSteps />
            </div>

            {/* Registration Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <RegistrationForm
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
