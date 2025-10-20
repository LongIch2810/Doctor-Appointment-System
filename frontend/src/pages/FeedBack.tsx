import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FadeInView from "@/components/view/FadeInView";

const Feedback = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã góp ý! Chúng tôi sẽ tiếp nhận và phản hồi sớm nhất.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <FadeInView>
      <section className="mt-16 md:mt-28">
        <div className="max-w-2xl mx-auto p-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary font-bold text-center">
                Góp ý & phản hồi
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-gray-700">
              <p>
                LifeHealth luôn mong muốn nâng cao chất lượng dịch vụ. Nếu bạn
                có ý kiến góp ý, phản hồi về trải nghiệm sử dụng, hãy để lại lời
                nhắn cho chúng tôi. Mọi góp ý đều được trân trọng!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ tên</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Nội dung góp ý</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Hãy chia sẻ ý kiến của bạn..."
                  />
                </div>

                <CardFooter className="p-0">
                  <Button type="submit" className="w-full">
                    Gửi góp ý
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </FadeInView>
  );
};

export default Feedback;
