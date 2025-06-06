import MainLayout from "@/layouts/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <MainLayout>
      <section className="mt-16 md:mt-28">
        <div className="max-w-3xl mx-auto p-6 mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary font-bold">
                Điều khoản thanh toán qua chuyển khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-gray-700 text-sm leading-relaxed">
              <p>
                Việc thanh toán qua chuyển khoản ngân hàng khi sử dụng dịch vụ
                trên nền tảng LifeHealth đồng nghĩa với việc bạn đã hiểu và đồng
                ý với các quy định dưới đây:
              </p>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Người dùng phải thực hiện chuyển khoản đúng theo thông tin tài
                  khoản ngân hàng do LifeHealth cung cấp trên hệ thống.
                </li>
                <li>
                  Nội dung chuyển khoản cần ghi rõ mã đơn hàng hoặc thông tin cá
                  nhân để xác minh thanh toán.
                </li>
                <li>
                  LifeHealth không chịu trách nhiệm với các khoản chuyển nhầm do
                  người dùng nhập sai thông tin.
                </li>
                <li>
                  Thời gian xác nhận giao dịch phụ thuộc vào hệ thống ngân hàng
                  (thông thường trong vòng 15–30 phút).
                </li>
                <li>
                  Sau khi chuyển khoản thành công, người dùng nên lưu lại biên
                  lai hoặc ảnh chụp màn hình để đối soát khi cần.
                </li>
                <li>
                  Mọi hành vi gian lận hoặc cố tình cung cấp thông tin giả mạo
                  sẽ bị xử lý theo quy định pháp luật.
                </li>
              </ul>

              <p>
                Nếu có sự cố liên quan đến việc chuyển khoản, người dùng vui
                lòng liên hệ bộ phận hỗ trợ LifeHealth qua email:{" "}
                <strong>support@lifehealth.vn</strong> hoặc hotline{" "}
                <strong>0909 123 456</strong> trong vòng 24 giờ kể từ thời điểm
                giao dịch.
              </p>

              <p>
                LifeHealth có quyền điều chỉnh các điều khoản này mà không cần
                thông báo trước. Người dùng nên kiểm tra định kỳ để cập nhật các
                thay đổi mới nhất.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default Terms;
