import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, XIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const header_items = [
  {
    name: "Bác sĩ",
    to: "/doctors",
  },
  {
    name: "Tin tức",
    to: "/news",
  },
  {
    name: "Liên hệ",
    to: "/contact",
  },
  {
    name: "Trợ lý AI",
    to: "/chatbot",
  },
];

const header_sub_items = [
  {
    name: "Lịch khám",
    to: "/",
  },
  {
    name: "Lịch sử thanh toán",
    to: "/",
  },
  {
    name: "Thông tin cá nhân",
    to: "/",
  },
  {
    name: "Hồ sơ sức khỏe",
    to: "/",
  },
];

type HeaderProps = {
  isLogged: boolean;
};

const Header: React.FC<HeaderProps> = ({ isLogged }) => {
  const navigate = useNavigate();
  return (
    <header className="fixed flex items-center justify-between px-6 py-4 bg-white shadow w-full z-[10]">
      <div className="flex items-center gap-x-5">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="cursor-pointer">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left">
              {header_items.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) =>
                    `p-2 rounded-lg ${
                      isActive
                        ? "text-primary font-semibold bg-secondary"
                        : "text-gray-700 hover:text-primary hover:bg-secondary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </SheetContent>
          </Sheet>
        </div>
        <div
          className="flex items-center gap-x-1 lg:gap-x-3 lg:text-2xl text-xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="../../../public/logo.jpg"
            alt="logo"
            className="w-10 h-10 lg:w-20 lg:h-20 rounded-lg"
          />
          <span>LifeHealth</span>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        {header_items.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive
                  ? "text-primary font-semibold bg-secondary"
                  : "text-gray-700 hover:text-primary hover:bg-secondary"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
        {!isLogged ? (
          <NavLink
            to="/sign-in"
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive
                  ? "text-primary font-semibold bg-secondary"
                  : "text-gray-700 hover:text-primary hover:bg-secondary"
              }`
            }
          >
            Đăng nhập
          </NavLink>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="ghost" className="flex items-center gap-2">
                Tài khoản ▼
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Chào bạn, anhlong!</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {header_sub_items.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="cursor-pointer"
                  onClick={() => navigate(item.to)}
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => alert("Đăng xuất")}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="md:hidden">
        {!isLogged ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `p-2 rounded-lg ${
                isActive
                  ? "text-primary font-semibold bg-secondary"
                  : "text-gray-700 hover:text-primary hover:bg-secondary"
              }`
            }
          >
            Đăng nhập
          </NavLink>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Button variant="ghost" className="flex items-center gap-2">
                Tài khoản ▼
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Chào bạn, anhlong!</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {header_sub_items.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="cursor-pointer"
                  onClick={() => navigate(item.to)}
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => alert("Đăng xuất")}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
