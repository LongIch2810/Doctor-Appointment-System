import React from "react";
import Header from "../components/header/Header";
import Footer from "@/components/footer/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header isLogged={false} />
      <main className="p-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
