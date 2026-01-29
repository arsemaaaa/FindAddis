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
import AuthContext from "./context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import "./styles/main.css";

// Helper component to restrict Admins/Vendors to their dashboard
function RoleBasedRoute({ children }) {
  const { user, isAdmin, isOwner } = useContext(AuthContext);

  // If logged in as Admin or Vendor, the standard pages are restricted
  if (user && (isAdmin() || isOwner())) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantsProvider>
          <div className="app-root">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<RoleBasedRoute><Home /></RoleBasedRoute>} />
                <Route path="/restaurants" element={<RoleBasedRoute><RestaurantListPage /></RoleBasedRoute>} />
                <Route path="/restaurants/:id" element={<RoleBasedRoute><RestaurantDetailsPage /></RoleBasedRoute>} />
                <Route path="/search" element={<RoleBasedRoute><SearchResultsPage /></RoleBasedRoute>} />
                <Route path="/write-review" element={<RoleBasedRoute><WriteReviewPage /></RoleBasedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/favorites" element={<RoleBasedRoute><Favorites /></RoleBasedRoute>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </RestaurantsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
