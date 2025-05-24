import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>KL LAZISMU BANTUL</h3>
            <p>Lembaga Amil Zakat, Infaq dan Shadaqah Muhammadiyah</p>
            <p>Kabupaten Bantul</p>
            <div className="islamic-greeting">
              <p>"Barakallahu fiikum"</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Kontak Kami</h4>
            <div className="contact-info">
              <p>📍 Alamat: Jl. Raya Bantul, Yogyakarta</p>
              <p>📞 Telepon: (0274) 123-4567</p>
              <p>✉️ Email: info@lazismubantul.org</p>
              <p>🌐 Website: www.lazismubantul.org</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Program Kami</h4>
            <ul className="footer-links">
              <li>Zakat & Infaq</li>
              <li>Pendidikan</li>
              <li>Kesehatan</li>
              <li>Ekonomi Umat</li>
              <li>Kemanusiaan</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Sistem Kehadiran</h4>
            <ul className="footer-links">
              <li>Absensi Online</li>
              <li>Laporan Kehadiran</li>
              <li>Manajemen Staff</li>
              <li>Bantuan Teknis</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} KL LAZISMU BANTUL. Semua hak cipta dilindungi.</p>
            <p>Sistem Kehadiran Digital - Membangun Transparansi dan Akuntabilitas</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
