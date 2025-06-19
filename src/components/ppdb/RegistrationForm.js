"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function RegistrationForm({
  selectedPackage,
  setSelectedPackage,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransferStudent, setIsTransferStudent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFileWarningModal, setShowFileWarningModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [fileErrors, setFileErrors] = useState({});
  const [errors, setErrors] = useState({});
  const modalContentRef = useRef(null);
  const inputRefs = useRef({});
  const [formData, setFormData] = useState({
    // Step 1
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    noWhatsApp: "",
    email: "",
    namaOrtu: "",
    nisn: "",
    // Step 2
    asalSekolah: "",
    kelasTerakhir: "",
    aktaKelahiran: null,
    kartuKeluarga: null,
    ktp: null,
    ijazahTerakhir: null,
    suratPindah: null,
  });

  useEffect(() => {
    if (showModal || showFileWarningModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal, showFileWarningModal]);

  const handleFileDelete = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setFileErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const validateFileSize = (file, fieldName) => {
    // Maximum file size (12MB in bytes)
    const MAX_FILE_SIZE = 12 * 1024 * 1024;

    if (file && file.size > MAX_FILE_SIZE) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: `Ukuran file melebihi batas maksimum 12MB`,
      }));
      return false;
    }

    setFileErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      // Validate file size
      if (validateFileSize(file, name)) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      } else {
        // Reset file input if validation fails
        e.target.value = null;
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      // Step 1
      nama: "Nama Lengkap",
      nisn: "NISN",
      tempatLahir: "Tempat Lahir",
      tanggalLahir: "Tanggal Lahir",
      jenisKelamin: "Jenis Kelamin",
      alamat: "Alamat Lengkap",
      noWhatsApp: "Nomor WhatsApp",
      email: "Email",
      namaOrtu: "Nama Orang Tua/Wali",
      // Step 2
      asalSekolah: "Asal Sekolah",
      kelasTerakhir: "Kelas Terakhir",
    };

    // Validate required fields
    let isValid = true;
    let firstEmptyField = null;

    Object.keys(requiredFields).forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = `${requiredFields[field]} wajib diisi`;
        isValid = false;
        if (!firstEmptyField) {
          firstEmptyField = field;
        }
      }
    });

    setErrors(newErrors);

    if (!isValid && firstEmptyField) {
      // Show SweetAlert with the list of empty fields
      const emptyFieldsList = Object.keys(newErrors)
        .map((field) => requiredFields[field])
        .join(", ");

      Swal.fire({
        title: "Form Belum Lengkap",
        text: `Silakan lengkapi field berikut: ${emptyFieldsList}`,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        // Focus on the first empty field
        if (
          currentStep === 1 &&
          [
            "nama",
            "nisn",
            "tempatLahir",
            "tanggalLahir",
            "jenisKelamin",
            "alamat",
            "noWhatsApp",
            "email",
            "namaOrtu",
          ].includes(firstEmptyField)
        ) {
          setTimeout(() => {
            if (inputRefs.current[firstEmptyField]) {
              inputRefs.current[firstEmptyField].focus();
            }
          }, 100);
        } else if (
          currentStep === 2 &&
          ["asalSekolah", "kelasTerakhir"].includes(firstEmptyField)
        ) {
          setTimeout(() => {
            if (inputRefs.current[firstEmptyField]) {
              inputRefs.current[firstEmptyField].focus();
            }
          }, 100);
        } else {
          // If the empty field is in a different step, switch to that step
          if (
            currentStep === 2 &&
            [
              "nama",
              "nisn",
              "tempatLahir",
              "tanggalLahir",
              "jenisKelamin",
              "alamat",
              "noWhatsApp",
              "email",
              "namaOrtu",
            ].includes(firstEmptyField)
          ) {
            setCurrentStep(1);
            setTimeout(() => {
              if (inputRefs.current[firstEmptyField]) {
                inputRefs.current[firstEmptyField].focus();
              }
            }, 100);
          } else if (
            currentStep === 1 &&
            ["asalSekolah", "kelasTerakhir"].includes(firstEmptyField)
          ) {
            setCurrentStep(2);
            setTimeout(() => {
              if (inputRefs.current[firstEmptyField]) {
                inputRefs.current[firstEmptyField].focus();
              }
            }, 100);
          }
        }
      });
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    const fileInputs = [
      "aktaKelahiran",
      "kartuKeluarga",
      "ktp",
      "ijazahTerakhir",
    ];

    if (isTransferStudent) {
      fileInputs.push("suratPindah");
    }

    const hasEmptyFile = fileInputs.some((input) => !formData[input]);

    // Check if there are any file errors
    const hasFileErrors = Object.values(fileErrors).some(
      (error) => error !== null && error !== undefined
    );

    if (hasFileErrors) {
      toast.error(
        "Ada kesalahan pada file yang diunggah. Periksa kembali ukuran file."
      );
      return;
    }

    if (hasEmptyFile) {
      setShowFileWarningModal(true);
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setHasScrolled(false);
    setIsAgreed(false);
  };

  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setHasScrolled(true);
    }
  };

  const handleFinalSubmit = async () => {
    if (isAgreed) {
      try {
        // Create FormData object
        const submitFormData = new FormData();

        // Add text fields
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null) {
            if (
              key === "aktaKelahiran" ||
              key === "kartuKeluarga" ||
              key === "ktp" ||
              key === "ijazahTerakhir" ||
              key === "suratPindah"
            ) {
              if (formData[key] instanceof File) {
                submitFormData.append(key, formData[key]);
              }
            } else {
              // Pastikan nilai string tidak undefined
              const value = formData[key] || "";
              submitFormData.append(key, value);
            }
          }
        });

        // Pastikan NISN selalu disertakan
        if (!submitFormData.has("nisn")) {
          submitFormData.append("nisn", formData.nisn || "");
        }

        // Add additional fields
        submitFormData.append("isTransferStudent", isTransferStudent);
        submitFormData.append("selectedPackage", selectedPackage);

        // Log FormData untuk debugging
        console.log("Form data yang dikirim:");
        for (const pair of submitFormData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const response = await fetch("/api/ppdb", {
          method: "POST",
          body: submitFormData, // Send as FormData instead of JSON
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Terjadi kesalahan saat mengirim formulir"
          );
        }

        // Show success message
        toast.success("Formulir berhasil dikirim!");

        // Reset form and close modal
        setFormData({
          nama: "",
          tempatLahir: "",
          tanggalLahir: "",
          jenisKelamin: "",
          alamat: "",
          noWhatsApp: "",
          email: "",
          namaOrtu: "",
          nisn: "",
          asalSekolah: "",
          kelasTerakhir: "",
          aktaKelahiran: null,
          kartuKeluarga: null,
          ktp: null,
          ijazahTerakhir: null,
          suratPindah: null,
        });
        setSelectedPackage("");
        setShowModal(false);
        setCurrentStep(1);
        setIsAgreed(false);
        setHasScrolled(false);
        setFileErrors({});
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          error.message || "Terjadi kesalahan saat mengirim formulir"
        );
      }
    }
  };

  const handleFileWarningClose = () => {
    setShowFileWarningModal(false);
    setShowModal(true);
  };

  const nextStep = () => {
    // Validate step 1 fields before proceeding to step 2
    const step1Fields = [
      "nama",
      "nisn",
      "tempatLahir",
      "tanggalLahir",
      "jenisKelamin",
      "alamat",
      "noWhatsApp",
      "email",
      "namaOrtu",
    ];
    const step1Errors = {};
    let isValid = true;
    let firstEmptyField = null;

    step1Fields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        const fieldLabels = {
          nama: "Nama Lengkap",
          nisn: "NISN",
          tempatLahir: "Tempat Lahir",
          tanggalLahir: "Tanggal Lahir",
          jenisKelamin: "Jenis Kelamin",
          alamat: "Alamat Lengkap",
          noWhatsApp: "Nomor WhatsApp",
          email: "Email",
          namaOrtu: "Nama Orang Tua/Wali",
        };

        step1Errors[field] = `${fieldLabels[field]} wajib diisi`;
        isValid = false;
        if (!firstEmptyField) {
          firstEmptyField = field;
        }
      }
    });

    if (!isValid) {
      setErrors(step1Errors);
      // Show SweetAlert with the list of empty fields
      const emptyFieldsList = Object.keys(step1Errors)
        .map((field) => {
          const fieldLabels = {
            nama: "Nama Lengkap",
            nisn: "NISN",
            tempatLahir: "Tempat Lahir",
            tanggalLahir: "Tanggal Lahir",
            jenisKelamin: "Jenis Kelamin",
            alamat: "Alamat Lengkap",
            noWhatsApp: "Nomor WhatsApp",
            email: "Email",
            namaOrtu: "Nama Orang Tua/Wali",
          };
          return fieldLabels[field];
        })
        .join(", ");

      Swal.fire({
        title: "Form Belum Lengkap",
        text: `Silakan lengkapi field berikut: ${emptyFieldsList}`,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        // Focus on the first empty field
        setTimeout(() => {
          if (inputRefs.current[firstEmptyField]) {
            inputRefs.current[firstEmptyField].focus();
          }
        }, 100);
      });
      return;
    }

    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const renderFileUploadField = (fieldName, label) => (
    <div className="relative">
      <label className="block text-base font-medium text-gray-700 mb-2">
        {label} (PDF)
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
        <div className="space-y-1 text-center w-full">
          {formData[fieldName] ? (
            <div className="relative">
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 truncate max-w-[80%]">
                  {formData[fieldName].name}
                </span>
                <button
                  type="button"
                  onClick={() => handleFileDelete(fieldName)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload file</span>
                  <input
                    type="file"
                    name={fieldName}
                    onChange={handleChange}
                    accept=".pdf"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">atau drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, maksimal 12MB</p>
            </>
          )}
          {fileErrors[fieldName] && (
            <p className="text-sm text-red-600 mt-1">{fileErrors[fieldName]}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900">
          Pilih Paket Pendidikan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["PAKET A", "PAKET B", "PAKET C"].map((pkg) => (
            <button
              key={pkg}
              type="button"
              onClick={() => setSelectedPackage(pkg)}
              className={`p-6 rounded-lg border-2 ${
                selectedPackage === pkg
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <h4 className="text-lg font-medium text-gray-900">{pkg}</h4>
              <p className="text-base text-gray-500 mt-2">
                {pkg === "PAKET A"
                  ? "Setara SD"
                  : pkg === "PAKET B"
                  ? "Setara SMP"
                  : "Setara SMA"}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.nama ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.nama = el)}
            required
          />
          {errors.nama && (
            <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            NISN (Nomor Induk Siswa Nasional){" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="nisn"
            value={formData.nisn || ""}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.nisn ? "border-red-500" : ""
            }`}
            placeholder="Masukkan NISN Anda"
            ref={(el) => (inputRefs.current.nisn = el)}
            required
          />
          {errors.nisn && (
            <p className="mt-1 text-sm text-red-600">{errors.nisn}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Tempat Lahir <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="tempatLahir"
            value={formData.tempatLahir}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.tempatLahir ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.tempatLahir = el)}
            required
          />
          {errors.tempatLahir && (
            <p className="mt-1 text-sm text-red-600">{errors.tempatLahir}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Tanggal Lahir <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.tanggalLahir ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.tanggalLahir = el)}
            required
          />
          {errors.tanggalLahir && (
            <p className="mt-1 text-sm text-red-600">{errors.tanggalLahir}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Jenis Kelamin <span className="text-red-600">*</span>
          </label>
          <select
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.jenisKelamin ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.jenisKelamin = el)}
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          {errors.jenisKelamin && (
            <p className="mt-1 text-sm text-red-600">{errors.jenisKelamin}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-base font-medium text-gray-700 mb-2">
            Alamat Lengkap <span className="text-red-600">*</span>
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows={4}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.alamat ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.alamat = el)}
            required
          />
          {errors.alamat && (
            <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Nomor WhatsApp <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            name="noWhatsApp"
            value={formData.noWhatsApp}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.noWhatsApp ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.noWhatsApp = el)}
            required
          />
          {errors.noWhatsApp && (
            <p className="mt-1 text-sm text-red-600">{errors.noWhatsApp}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.email ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.email = el)}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">
            Nama Orang Tua/Wali <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="namaOrtu"
            value={formData.namaOrtu}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
              errors.namaOrtu ? "border-red-500" : ""
            }`}
            ref={(el) => (inputRefs.current.namaOrtu = el)}
            required
          />
          {errors.namaOrtu && (
            <p className="mt-1 text-sm text-red-600">{errors.namaOrtu}</p>
          )}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={nextStep}
          className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lanjutkan ke Tahap 2
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900">
            Data Pendidikan Sebelumnya
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Asal Sekolah <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="asalSekolah"
                value={formData.asalSekolah}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
                  errors.asalSekolah ? "border-red-500" : ""
                }`}
                ref={(el) => (inputRefs.current.asalSekolah = el)}
                required
              />
              {errors.asalSekolah && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.asalSekolah}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Kelas Terakhir <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="kelasTerakhir"
                value={formData.kelasTerakhir}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 text-black ${
                  errors.kelasTerakhir ? "border-red-500" : ""
                }`}
                ref={(el) => (inputRefs.current.kelasTerakhir = el)}
                required
              />
              {errors.kelasTerakhir && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.kelasTerakhir}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Peserta Didik */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-900">
            Status Peserta Didik
          </h3>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsTransferStudent(!isTransferStudent)}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-200"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  isTransferStudent ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <p className="ml-3 text-base font-medium text-gray-900">
              {isTransferStudent
                ? "Peserta Didik Mutasi/Pindahan"
                : "Peserta Didik Baru"}
            </p>
          </div>
        </div>

        {/* Dokumen Upload */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900">Upload Dokumen</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFileUploadField("aktaKelahiran", "Akta Kelahiran")}
            {renderFileUploadField("kartuKeluarga", "Kartu Keluarga")}
            {renderFileUploadField("ktp", "KTP")}
            {renderFileUploadField("ijazahTerakhir", "Ijazah Terakhir")}

            {isTransferStudent &&
              renderFileUploadField("suratPindah", "Surat Keterangan Pindah")}
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 flex justify-center py-4 px-6 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="flex-1 flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Daftar Sekarang
        </button>
      </div>
    </>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Formulir Pendaftaran
        </h2>
        <div className="text-lg font-medium text-gray-600">
          Tahap {currentStep} dari 2
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </form>

      {/* File Warning Modal */}
      {showFileWarningModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pemberitahuan
            </h3>
            <p className="text-gray-600 mb-4">
              Anda tidak menyerahkan dokumen secara digital. Siswa akan
              diwajibkan menyerahkan dokumen yang diperlukan ke kantor SKB.
            </p>
            <p className="text-gray-600 mb-4">
              Alamat: Jl. Lorem Asdawda
              <br />
              Waktu Operasional: Senin - Jumat (7-13)
              <br />
              Kontak Person: 08xxxxxx
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFileWarningClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-hidden"
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Syarat dan Ketentuan
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                UPT SPNF SKB Belitung
              </p>
            </div>

            <div
              ref={modalContentRef}
              onScroll={handleModalScroll}
              className="p-6 overflow-y-auto flex-grow"
            >
              <div className="space-y-4 text-gray-600">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
                <p>
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit
                  amet, consectetur, adipisci velit, sed quia non numquam eius
                  modi tempora incidunt ut labore et dolore magnam aliquam
                  quaerat voluptatem.
                </p>
                <p>
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam
                  corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                  consequatur? Quis autem vel eum iure reprehenderit qui in ea
                  voluptate velit esse quam nihil molestiae consequatur.
                </p>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident.
                </p>
                <p>
                  Similique sunt in culpa qui officia deserunt mollitia animi,
                  id est laborum et dolorum fuga. Et harum quidem rerum facilis
                  est et expedita distinctio.
                </p>
                <p>
                  Similique sunt in culpa qui officia deserunt mollitia animi,
                  id est laborum et dolorum fuga. Et harum quidem rerum facilis
                  est et expedita distinctio.
                </p>
                <p>
                  Similique sunt in culpa qui officia deserunt mollitia animi,
                  id est laborum et dolorum fuga. Et harum quidem rerum facilis
                  est et expedita distinctio.
                </p>
                <p>
                  Similique sunt in culpa qui officia deserunt mollitia animi,
                  id est laborum et dolorum fuga. Et harum quidem rerum facilis
                  est et expedita distinctio.
                </p>
                <p>
                  Similique sunt in culpa qui officia deserunt mollitia animi,
                  id est laborum et dolorum fuga. Et harum quidem rerum facilis
                  est et expedita distinctio.
                </p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    disabled={!hasScrolled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="text-sm">
                  <label className="font-medium text-gray-700">
                    Saya telah membaca dan menyetujui syarat dan ketentuan
                  </label>
                  {!hasScrolled && (
                    <p className="text-red-500 mt-1">
                      Silakan scroll ke bawah untuk membaca seluruh syarat dan
                      ketentuan
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!isAgreed}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isAgreed
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Setuju & Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
