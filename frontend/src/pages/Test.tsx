import React, { useState, useEffect } from "react";
import HtmlAnswerBox from "./HtmlAnswerBox";

export default function Test() {
  const [htmlAnswer, setHtmlAnswer] = useState("");

  useEffect(() => {
    // giả lập gọi API từ LangChain
    const mockData = {
      answer:
        '<div class="p-4 bg-gray-50 rounded-lg shadow-inner max-w-full mx-auto">\n' +
        '    <h2 class="text-xl font-semibold text-gray-800 mb-4">Danh sách các chuyên khoa</h2>\n' +
        '    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">\n' +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Nội tổng quát</h3>\n' +
        '                <p class="text-sm text-gray-600">Khám và điều trị bệnh nội chung</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Nhi khoa</h3>\n' +
        '                <p class="text-sm text-gray-600">Khám và điều trị cho trẻ em</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Tai - Mũi - Họng</h3>\n' +
        '                <p class="text-sm text-gray-600">Chuyên điều trị các bệnh tai, mũi, họng</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Tim mạch</h3>\n' +
        '                <p class="text-sm text-gray-600">Chuyên điều trị các bệnh lý tim</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Da liễu</h3>\n' +
        '                <p class="text-sm text-gray-600">Chuyên điều trị các bệnh da liễu</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Xương khớp</h3>\n' +
        '                <p class="text-sm text-gray-600">Chấn thương chỉnh hình và cơ xương khớp</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Phụ sản</h3>\n' +
        '                <p class="text-sm text-gray-600">Chăm sóc sức khỏe sinh sản và thai kỳ</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Tiêu hóa</h3>\n' +
        '                <p class="text-sm text-gray-600">Khám và điều trị các bệnh tiêu hóa</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Thần kinh</h3>\n' +
        '                <p class="text-sm text-gray-600">Điều trị các bệnh lý thần kinh</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        '        <div class="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">\n' +
        "            <div>\n" +
        '                <h3 class="text-lg font-medium text-blue-600 mb-2">Mắt</h3>\n' +
        '                <p class="text-sm text-gray-600">Khám và điều trị các vấn đề về mắt</p>\n' +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>",
    };

    setHtmlAnswer(mockData.answer);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <HtmlAnswerBox html={htmlAnswer} />
    </div>
  );
}
