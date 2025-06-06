import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const categories = [
  "Sức khỏe",
  "Dinh dưỡng",
  "Tập luyện",
  "Tâm lý",
  "Bệnh lý",
  "Tin tức",
];

const articles = [
  {
    title: "Bí quyết giữ gìn sức khỏe vào mùa hè",
    author: "BS. Nguyễn Văn A",
    authorAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
    image: "https://source.unsplash.com/800x600/?health,summer",
    date: "03/06/2025",
    excerpt:
      "Mùa hè nóng bức có thể gây ảnh hưởng nghiêm trọng đến sức khỏe. Hãy cùng tìm hiểu cách chăm sóc bản thân đúng cách...",
    slug: "bi-quyet-giu-suc-khoe-mua-he",
  },
  {
    title: "Chế độ dinh dưỡng hợp lý cho người cao tuổi",
    author: "ThS. Trần Thị B",
    authorAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
    image: "https://source.unsplash.com/800x600/?nutrition,elderly",
    date: "01/06/2025",
    excerpt:
      "Người cao tuổi cần một chế độ ăn uống cân bằng để duy trì sức khỏe và năng lượng hàng ngày...",
    slug: "che-do-dinh-duong-nguoi-cao-tuoi",
  },
  {
    title: "Lợi ích của việc tập yoga mỗi ngày",
    author: "HLV. Phạm Văn C",
    authorAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
    image: "https://source.unsplash.com/800x600/?yoga,exercise",
    date: "28/05/2025",
    excerpt:
      "Tập yoga không chỉ giúp cơ thể dẻo dai mà còn cải thiện tinh thần và giảm stress hiệu quả...",
    slug: "loi-ich-tap-yoga-moi-ngay",
  },
  {
    title: "Phương pháp giảm căng thẳng hiệu quả",
    author: "Chuyên gia Tâm lý học - Lê Thị D",
    authorAvatar: "https://randomuser.me/api/portraits/women/13.jpg",
    image: "https://source.unsplash.com/800x600/?relaxation,mindfulness",
    date: "25/05/2025",
    excerpt:
      "Căng thẳng kéo dài ảnh hưởng xấu đến sức khỏe. Hãy thử áp dụng các phương pháp đơn giản dưới đây để thư giãn...",
    slug: "phuong-phap-giam-cang-thang",
  },
  {
    title: "Những bệnh lý thường gặp trong mùa đông",
    author: "BS. Nguyễn Văn E",
    authorAvatar: "https://randomuser.me/api/portraits/men/14.jpg",
    image: "https://source.unsplash.com/800x600/?winter,health",
    date: "20/05/2025",
    excerpt:
      "Mùa đông với khí hậu lạnh là điều kiện thuận lợi cho nhiều bệnh phát triển. Hãy chuẩn bị kiến thức để phòng tránh...",
    slug: "nhung-benh-ly-thuong-gap-mua-dong",
  },
];

const News = () => {
  const [search, setSearch] = useState("");

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-primary text-white shadow">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Logo + text */}
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img
              src="/logo.jpg"
              alt="LifeHealth Logo"
              className="w-12 h-12 object-contain rounded-md"
            />
            <h1 className="text-3xl font-bold">LifeHealth News</h1>
          </div>

          {/* Search */}
          <div className="w-full max-w-xs md:w-auto relative text-gray-700">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm bài viết..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <nav className="bg-primary/90 border-t border-primary/70 overflow-x-auto whitespace-nowrap px-4 py-2">
          <div className="container mx-auto flex space-x-6 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/news/category/${cat.toLowerCase()}`}
                className="hover:underline px-2 py-1 rounded-md hover:bg-white hover:text-primary transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {filteredArticles.length === 0 ? (
          <p className="text-center text-gray-500">
            Không tìm thấy bài viết phù hợp.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredArticles.map((article) => (
              <Card
                key={article.slug}
                className="overflow-hidden shadow-md flex flex-col"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="flex flex-col flex-grow">
                  <Link
                    to={`/news/${article.slug}`}
                    className="text-xl font-bold hover:text-primary hover:underline mb-2"
                  >
                    {article.title}
                  </Link>
                  <p className="text-gray-600 flex-grow">{article.excerpt}</p>

                  <div className="mt-4 flex items-center space-x-3 text-sm text-gray-400">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={article.authorAvatar}
                        alt={article.author}
                      />
                      <AvatarFallback>
                        {article.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{article.author}</p>
                      <p>{article.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default News;
