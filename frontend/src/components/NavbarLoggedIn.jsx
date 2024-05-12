import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const logoutUser = async () => {
    try {
      const res = await axios.post("/logout");
      if (res.status === 200) {
        setUser(null);
        toast.success("Sesión cerrada, ¡Adiós!");
        navigate("/");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/">Inicio</Link>
      <Link to="/news">Novedades</Link>
      <Link to="/store">Tienda</Link>
      <Link to="/contact">Contacto</Link>
      <Link to="/about">Sobre el proyecto</Link>
      <Link to="/profile">Perfil</Link>
      <button onClick={logoutUser}>Cerrar sesión</button>
    </ul>
  );

  return (
    <nav className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-fuchsia-300">
      <div className="flex items-center justify-between text-blue-gray-900">
        <h1>
          <Link to="/">LAXART</Link>
        </h1>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
        </div>
      </div>
    </nav>
  );
}
