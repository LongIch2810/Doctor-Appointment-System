import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Giả lập API
    await new Promise((r) => setTimeout(r, 1200));

    if (username === "admin" && password === "123456") {
      alert("Đăng nhập thành công!");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-primary text-white">
      {/* Left branding (logo + text) */}
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
          Đăng nhập để đặt lịch khám, theo dõi hồ sơ sức khỏe và kết nối với bác
          sĩ mọi lúc, mọi nơi.
        </p>
      </div>

      {/* Right form */}
      <div className="bg-white text-gray-900 flex items-center justify-center p-6 md:p-12 rounded-t-3xl md:rounded-tl-3xl md:rounded-bl-3xl shadow-lg flex-1">
        <Card className="w-full max-w-md shadow-none rounded-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-extrabold mb-2">
              Đăng nhập
            </CardTitle>
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/sign-up"
                className="text-primary hover:underline font-semibold"
              >
                Đăng ký ngay
              </Link>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="text"
                placeholder="Tên đăng nhập hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-base"
              />
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
              {error && (
                <p className="text-red-600 text-center text-sm font-medium">
                  {error}
                </p>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <Link to="/forgot-password" className="hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-base"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-8">
              <div className="flex items-center justify-center text-sm text-gray-400">
                <span>hoặc đăng nhập với</span>
              </div>
              <div className="mt-4">
                <Button
                  variant={"google"}
                  className="flex items-center justify-center w-full px-4 py-2"
                  onClick={() => alert("Google Login")}
                >
                  <FaGoogle className="mr-2" /> Google
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
