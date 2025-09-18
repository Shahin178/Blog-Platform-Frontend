import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import WelcomePage from "./pages/WelcomePage";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import WritePost from "./pages/WritePost";
import BlogDetail from "./pages/BlogDetail";
import UpdatePost from "./pages/UpdatePost";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/write" element={<WritePost />} />
          <Route path="/blog/edit/:postId" element={<UpdatePost />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
