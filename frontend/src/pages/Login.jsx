import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Bienvenido ${email}!`);
        setUser(data.user);
        setData({});
        navigate("/");
      }
    } catch (error) {}
  };

  const createOrGetuser = async (response) => {
    const decoded = jwtDecode(response); // Error
    console.log(decoded);
  };

  return (
    <>
      {!user ? (
        <form onSubmit={loginUser}>
          <label>Correo</label>
          <input
            className="mx-8"
            type="email"
            placeholder="Ingresar correo..."
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <label>Contraseña</label>
          <input
            className="mx-8"
            type="password"
            placeholder="Ingresar contraseña..."
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="submit" className="bg-blue-400 rounded p-3 m-2">
            Iniciar sesión
          </button>
          <GoogleLogin
            onSuccess={(response) => createOrGetuser(response)}
            onError={() => console.log("Error")}
          />
        </form>
      ) : (
        navigate("/error")
      )}
    </>
  );
}
