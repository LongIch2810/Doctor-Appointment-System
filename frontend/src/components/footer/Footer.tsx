import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-100 border-t mt-10 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo and Description */}
        <div className="md:col-span-2">
          <div
            className="flex items-center gap-x-2 lg:text-2xl text-xl font-bold text-primary cursor-pointer mb-3"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg"
            />
            <span>LifeHealth</span>
          </div>
          <p className="mb-4">
            Nền tảng y tế số kết nối bạn với đội ngũ bác sĩ uy tín trên toàn
            quốc.
          </p>

          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary mt-[2px]" />
            <span>123 Lý Thường Kiệt, P.7, Q.10, TP.HCM</span>
          </div>
          <div className="flex items-start gap-2 mb-2">
            <Phone className="w-4 h-4 text-primary mt-[2px]" />
            <span>1900 123 456</span>
          </div>
          <div className="flex items-start gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary mt-[2px]" />
            <span>support@lifehealth.vn</span>
          </div>

          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook">
              <Facebook className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-primary" />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube className="w-5 h-5 hover:text-primary" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Về LifeHealth</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/team">Đội ngũ</Link>
            </li>
            <li>
              <Link to="/careers">Tuyển dụng</Link>
            </li>
            <li>
              <Link to="/news">Tin tức</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Dịch vụ</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/booking">Đặt khám</Link>
            </li>
            <li>
              <Link to="/specialties">Chuyên khoa</Link>
            </li>
            <li>
              <Link to="/doctors">Bác sĩ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Hỗ trợ</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/faq">Câu hỏi thường gặp</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
            <li>
              <Link to="/terms">Điều khoản</Link>
            </li>
            <li>
              <Link to="/feedback">Góp ý</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="text-sm font-medium text-gray-700">
            Đăng ký nhận bản tin y tế mới nhất từ LifeHealth
          </h4>
          <form className="flex items-center w-full md:w-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="border border-gray-300 rounded-l px-3 py-2 w-full md:w-64 outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary/90 transition"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t text-center py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} LifeHealth. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
