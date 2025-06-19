"use client";

export default function RegistrationSteps() {
  const steps = [
    {
      id: 1,
      title: "Pendaftaran PPDB Dibuka",
      description: "Pendaftaran PPDB telah dibuka untuk tahun ajaran baru",
    },
    {
      id: 2,
      title: "Melakukan Pendaftaran Online",
      description: "Isi formulir pendaftaran online dengan lengkap",
    },
    {
      id: 3,
      title: "Menunggu Konfirmasi WhatsApp",
      description: "Konfirmasi pendaftaran akan dikirimkan melalui WhatsApp",
    },
    {
      id: 4,
      title: "Tunggu Hari Pengumuman",
      description: "Tunggu hingga hari pengumuman kelulusan",
    },
    {
      id: 5,
      title: "Cek Kelulusan di Website",
      description: "Cek status kelulusan melalui website resmi",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
        Alur Pendaftaran PPDB
      </h2>
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-lg font-semibold mb-4">
                {step.id}
              </div>
              <div className="text-center max-w-[200px]">
                <h3 className="text-sm font-medium text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-[60%] w-[80%] h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
