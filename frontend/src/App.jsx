import { React } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Register,
  About,
  Profile,
  Cart,
  Contact,
  News,
  Store,
  Product,
  Error,
  EmailVerification,
  AdminDashboard,
  AdminProducts
} from "./Routes";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

axios.defaults.baseURL = import.meta.env.VITE_APP_AXIOS_BASE_URL;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <GoogleOAuthProvider
      clientId={`${import.meta.env.VITE_APP_GOOGLE_API_TOKEN}`}
    >
      <UserContextProvider>
        <Navbar />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2500 }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<News />} />
          <Route path="/store/:genre" element={<Store />} />
          <Route path="/store/:genre/:productName" element={<Product />} />
          <Route path="/users/:id/verify/:token" element={<EmailVerification />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/products" element={<AdminProducts />} />
          <Route path="/*" element={<Error />} />
        </Routes>
        <Footer />
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}
