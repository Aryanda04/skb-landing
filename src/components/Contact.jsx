const Contact = () => {
  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
            Hubungi Kami
          </h2>
          <p className="text-gray-600 mt-2">
            Kami siap membantu Anda. Kunjungi kami atau hubungi melalui kontak
            di bawah.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">
              Informasi Kontak
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <i className="fas fa-map-marker-alt text-[#2563eb] text-2xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-700">Alamat</h4>
                  <p className="text-gray-600">
                    Jl. Jend. Sudirman Km.7, Perawas, Kec. Tj. Pandan, Kabupaten
                    Belitung, Kepulauan Bangka Belitung 33413
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <i className="fas fa-phone text-[#2563eb] text-2xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-700">Telepon</h4>
                  <p className="text-gray-600">(0719)-24253 </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <i className="fas fa-envelope text-[#2563eb] text-2xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-700">Email</h4>
                  <p className="text-gray-600">skbbelitung2@gmail.com </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.230947715376!2d107.68790647478163!3d-2.747797347229408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e173d9642922a5b%3A0xc959f3d49cb2aaa5!2s7M2R%2BW43%20SKB%20Belitung%2C%20Jl.%20Jend.%20Sudirman%2C%20Perawas%2C%20Kec.%20Tj.%20Pandan%2C%20Kabupaten%20Belitung%2C%20Kepulauan%20Bangka%20Belitung%2033413!5e0!3m2!1sid!2sid!4v1750299389014!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
