import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Doctor from "@/pages/Doctor";
import News from "@/pages/News";
import Contact from "@/pages/Contact";
import Chatbot from "@/pages/Chatbot";
import NotFound from "@/pages/NotFound";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Feedback from "@/pages/FeedBack";
import Team from "@/pages/Team";
import Careers from "@/pages/Careers";
import ForgotPassword from "@/pages/ForgotPassword";
import Test from "@/pages/Test";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/doctors" element={<Doctor />}></Route>
      <Route path="/news" element={<News />}></Route>
      <Route path="/contact" element={<Contact />}></Route>
      <Route path="/chatbot" element={<Chatbot />}></Route>
      <Route path="/faq" element={<FAQ />}></Route>
      <Route path="/terms" element={<Terms />}></Route>
      <Route path="/feedback" element={<Feedback />}></Route>
      <Route path="/team" element={<Team />}></Route>
      <Route path="/careers" element={<Careers />}></Route>
      <Route path="/sign-in" element={<SignIn />}></Route>
      <Route path="/sign-up" element={<SignUp />}></Route>
      <Route path="/forgot" element={<ForgotPassword />}></Route>
      <Route path="/test" element={<Test />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
};

export default AppRoutes;
