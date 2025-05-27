import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <h3 className="footer-brand">KL LAZISMU BANTUL</h3>
        <p className="footer-tagline">"Barakallahu fiikum" - Lembaga Amil Zakat, Infaq dan Shadaqah Muhammadiyah</p>

        <div className="footer-info">
          <p>📍 Jl. Raya Bantul, Yogyakarta</p>
          <p>📞 (0274) 123-4567 | ✉️ info@lazismubantul.org</p>
          <p>🌐 www.lazismubantul.org</p>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} KL LAZISMU BANTUL. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
