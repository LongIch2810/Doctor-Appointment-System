// ContactPage.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import FadeInView from "@/components/view/FadeInView";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Gửi liên hệ:", formData);
    alert("Cảm ơn bạn đã liên hệ LifeHealth!");
  };

  return (
    <section className="mt-16 md:mt-28">
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
        {/* Phần giới thiệu về LifeHealth */}
        <FadeInView>
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              LifeHealth - Đặt lịch khám bác sĩ uy tín
            </h1>
            <p className="text-gray-700 text-lg">
              LifeHealth là nền tảng chăm sóc sức khỏe trực tuyến hàng đầu tại
              Việt Nam, giúp bạn dễ dàng đặt lịch khám với các bác sĩ và bệnh
              viện uy tín chỉ với vài thao tác.
            </p>
            <p className="text-gray-600">
              Với sứ mệnh "Chăm sóc sức khỏe cho mọi người, mọi lúc, mọi nơi",
              LifeHealth đã và đang trở thành cầu nối tin cậy giữa người bệnh và
              hệ thống y tế chất lượng cao.
            </p>
          </section>
        </FadeInView>

        {/* Dẫn chứng về uy tín */}
        <FadeInView>
          <section className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-xl font-semibold text-primary mb-2">
                +500 bác sĩ chuyên khoa
              </h2>
              <p className="text-sm text-gray-600">
                Hợp tác với các bác sĩ đầu ngành tại TP.HCM, Hà Nội, Đà Nẵng...
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-xl font-semibold text-primary mb-2">
                +20 bệnh viện đối tác
              </h2>
              <p className="text-sm text-gray-600">
                Liên kết với các cơ sở y tế lớn như Bệnh viện Đại học Y Dược,
                Vinmec, Hoàn Mỹ...
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Hơn 100.000 người dùng
              </h2>
              <p className="text-sm text-gray-600">
                Đã và đang sử dụng LifeHealth để đặt khám và theo dõi sức khỏe
                định kỳ.
              </p>
            </div>
          </section>
        </FadeInView>

        {/* Thành tựu nổi bật và uy tín */}
        <FadeInView>
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary text-center">
              🌟 Vì sao chọn LifeHealth?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 space-y-2 text-gray-700 text-sm">
                  <h3 className="text-lg font-bold text-primary">
                    📈 Tăng trưởng ấn tượng
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Hơn <strong>3 triệu người dùng</strong> trên toàn quốc
                    </li>
                    <li>
                      Hơn <strong>1 triệu lượt đặt lịch mỗi năm</strong>
                    </li>
                    <li>
                      Tỷ lệ hài lòng lên tới <strong>98%</strong>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2 text-gray-700 text-sm">
                  <h3 className="text-lg font-bold text-primary">
                    🩺 Mạng lưới y tế hàng đầu
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>+1.200 bác sĩ chuyên khoa giàu kinh nghiệm</li>
                    <li>
                      Hợp tác với hơn 40 bệnh viện lớn như Vinmec, Y Dược, Hoàn
                      Mỹ...
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2 text-gray-700 text-sm">
                  <h3 className="text-lg font-bold text-primary">
                    🌐 Công nghệ hiện đại
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>AI hỗ trợ chẩn đoán sơ bộ, nhắc lịch tự động</li>
                    <li>Hồ sơ y tế điện tử, đồng bộ trên nhiều thiết bị</li>
                    <li>Ứng dụng đa nền tảng: iOS & Android</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-2 text-gray-700 text-sm">
                  <h3 className="text-lg font-bold text-primary">
                    🛡️ Bảo mật & Uy tín
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Đáp ứng tiêu chuẩn bảo mật: HIPAA, ISO 27001</li>
                    <li>Được Bộ Y tế đánh giá cao trong chuyển đổi số</li>
                    <li>Cam kết bảo mật tuyệt đối thông tin người dùng</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </FadeInView>

        {/* Thông tin & form liên hệ */}
        <section className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Thông tin liên hệ */}
          <Card>
            <CardContent className="p-6 space-y-4 text-sm">
              <h2 className="text-xl font-semibold text-primary">
                Thông tin liên hệ
              </h2>
              <p>
                <strong>🏢 Trụ sở:</strong> 123 Lê Lợi, Quận 1, TP.HCM
              </p>
              <p>
                <strong>📞 Hotline:</strong> 0909 123 456
              </p>
              <p>
                <strong>📧 Email:</strong> support@lifehealth.vn
              </p>
              <p>
                <strong>🕒 Giờ làm việc:</strong> Thứ 2 - Thứ 7: 8h - 17h
              </p>
            </CardContent>
          </Card>

          {/* Form liên hệ */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Gửi liên hệ</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ tên</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Nội dung</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Gửi liên hệ
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
};

export default Contact;
