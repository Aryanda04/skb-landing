"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Gallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef();

  const galleryImages = [
    "/galeri/galeri-1.jpg",
    "/galeri/galeri-2.jpg",
    "/galeri/galeri-3.jpg",
    "/galeri/galeri-4.jpg",
    "/galeri/galeri-5.jpg",
    "/galeri/galeri-6.jpg",
    "/galeri/galeri-7.jpg",
    "/galeri/galeri-8.jpg",
    "/galeri/galeri-9.jpg",
    "/galeri/galeri-10.jpg",
  ];

  const totalSlides = galleryImages.length;

  // Fungsi untuk menampilkan slide berikutnya
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  // Fungsi untuk menampilkan slide sebelumnya
  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  // Efek untuk menjalankan slideshow otomatis
  useEffect(() => {
    const play = () => {
      nextSlide();
    };

    autoPlayRef.current = play;

    const interval = setInterval(play, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mendapatkan indeks untuk 3 gambar yang akan ditampilkan (current, prev, next)
  const visibleSlides = [];
  for (let i = -1; i <= 1; i++) {
    const index = (currentSlide + i + totalSlides) % totalSlides;
    visibleSlides.push(index);
  }

  return (
    <section id="galeri" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
            Galeri Kegiatan
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            Momen-momen berharga dalam proses belajar.
          </p>
        </div>

        {/* Slideshow Gallery */}
        <div className="relative overflow-hidden max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-xl">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Foto Kegiatan ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === currentSlide}
                  />
                </div>
              ))}

              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#1e3a8a] p-2 rounded-full shadow-md"
                aria-label="Previous slide"
              >
                <i className="fas fa-chevron-left text-xl"></i>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-[#1e3a8a] p-2 rounded-full shadow-md"
                aria-label="Next slide"
              >
                <i className="fas fa-chevron-right text-xl"></i>
              </button>
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center gap-2 mt-4">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-[#1e3a8a] w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail grid preview */}
        <div className="grid grid-cols-5 gap-2 mt-12 max-w-5xl mx-auto">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative h-24 overflow-hidden rounded-lg cursor-pointer transition-all ${
                index === currentSlide
                  ? "ring-4 ring-[#1e3a8a]"
                  : "hover:opacity-80"
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
