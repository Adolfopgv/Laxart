import { React } from "react";
import Navbar from "./components/Navbar";
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
  Error,
  EmailVerification,
} from "./Routes";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
          <Route path="/store" element={<Store />} />
          <Route path="/users/:id/verify/:token" element={<EmailVerification />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}
