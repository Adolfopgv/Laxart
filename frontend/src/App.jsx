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
  AdminProducts,
  Wrapper,
  OrderFinished,
  AdminOrders,
  AdminCustomers,
  Legal,
} from "./Routes";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";
import { CartContextProvider } from "./context/cartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

axios.defaults.baseURL = import.meta.env.VITE_APP_AXIOS_BASE_URL;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <GoogleOAuthProvider
      clientId={`${import.meta.env.VITE_APP_GOOGLE_API_TOKEN}`}
    >
      <UserContextProvider>
        <CartContextProvider>
          <Navbar />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2500 }}
          />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/news" element={<News />} />
                <Route path="/store/:genre" element={<Store />} />
                <Route
                  path="/store/:genre/:productName"
                  element={<Product />}
                />
                <Route
                  path="/users/:id/verify/:token"
                  element={<EmailVerification />}
                />
                <Route
                  path="/admin-dashboard/products"
                  element={<AdminProducts />}
                />
                <Route
                  path="/admin-dashboard/orders"
                  element={<AdminOrders />}
                />
                <Route
                  path="/admin-dashboard/customers"
                  element={<AdminCustomers />}
                />
                <Route path="/checkout" element={<Wrapper />} />
                <Route path="/order-finished" element={<OrderFinished />} />
                <Route path="/*" element={<Error />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartContextProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}
