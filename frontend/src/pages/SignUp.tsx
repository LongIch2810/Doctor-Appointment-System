import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (username && email && password.length >= 6) {
      alert("Đăng ký thành công!");
      // Redirect hoặc clear form tại đây nếu cần
    } else {
      setError("Vui lòng nhập đầy đủ thông tin hợp lệ.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-primary text-white">
      {/* Left branding */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16 flex-1 text-center md:text-left">
        <img
          src="../../public/logo.jpg"
          alt="Logo"
          className="mb-6 w-24 md:w-28 object-cover rounded-lg"
        />
        <div className="text-3xl md:text-5xl font-extrabold mb-4">
          <Typewriter
            words={["Chào mừng bạn đến với LifeHealth."]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={100} // Tốc độ gõ chậm hơn → mượt
            deleteSpeed={60} // Tốc độ xoá chậm hơn → mượt
            delaySpeed={2000} // Giữ lại chữ lâu hơn một chút
          />
        </div>
        <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-lg">
          Đăng ký tài khoản để bắt đầu quản lý sức khỏe, đặt lịch khám và kết
          nối với bác sĩ của bạn.
        </p>
      </div>

      {/* Right form */}
      <div className="bg-white text-gray-900 flex items-center justify-center p-6 md:p-12 rounded-t-3xl md:rounded-tl-3xl md:rounded-bl-3xl shadow-lg flex-1">
        <Card className="w-full max-w-md shadow-none rounded-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-extrabold mb-2">
              Đăng ký
            </CardTitle>
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/sign-in"
                className="text-primary hover:underline font-semibold"
              >
                Đăng nhập
              </Link>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <p className="text-red-600 text-center text-sm font-medium">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full py-3 text-base"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
