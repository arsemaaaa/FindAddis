import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import RestaurantListPage from "./pages/RestaurantListPage";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import WriteReviewPage from "./pages/WriteReviewPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfilePage from "./pages/UserProfilePage";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { RestaurantsProvider } from "./context/RestaurantsContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/common/ToastContainer";
import { useToastContext } from "./context/ToastContext";
import "./styles/main.css";

function AppContent() {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/write-review" element={<WriteReviewPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantsProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </RestaurantsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
