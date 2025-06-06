import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import OtpInput from "@/components/input/OtpInput";
type Step = "email" | "otp" | "reset";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Đã gửi mã OTP đến email");
      setStep("otp");
    } catch {
      toast.error("Lỗi khi gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP");
      return;
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Xác minh OTP thành công");
      setStep("reset");
    } catch {
      toast.error("OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Đặt lại mật khẩu thành công");
      // Có thể chuyển hướng về trang đăng nhập ở đây
    } catch {
      toast.error("Không thể đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {step === "email"
              ? "Quên mật khẩu"
              : step === "otp"
              ? "Nhập mã OTP"
              : "Đặt lại mật khẩu"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp();
              }}
              className="space-y-4"
            >
              <Input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtp();
              }}
              className="space-y-4"
            >
              <OtpInput value={otp} onChange={setOtp} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang xác minh..." : "Xác minh mã OTP"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Không nhận được mã?{" "}
                <button
                  type="button"
                  onClick={sendOtp}
                  className="text-blue-500 hover:underline"
                >
                  Gửi lại
                </button>
              </p>
            </form>
          )}

          {step === "reset" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                resetPassword();
              }}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
