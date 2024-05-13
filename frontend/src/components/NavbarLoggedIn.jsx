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
    <ul className="mt-2 mb-4 m-3 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/" className="btn btn-ghost">
        Inicio
      </Link>
      <Link to="/news" className="btn btn-ghost">
        Novedades
      </Link>
      <Link to="/store" className="btn btn-ghost">
        Tienda
      </Link>
      <Link to="/contact" className="btn btn-ghost">
        Contacto
      </Link>
      <Link to="/about" className="btn btn-ghost">
        Sobre el proyecto
      </Link>
    </ul>
  );

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Laxart
        </Link>
      </div>
      <div className="flex-none max-lg:hidden lg:flex">
        <div>{navList}</div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle mr-5"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <Link to="/cart" className="btn btn-primary btn-block">
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Avatar" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to={"/profile"} className="justify-between">
                Perfil
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <a>Configuración</a>
            </li>
            <li>
              <button className="btn btn-primary mt-2" onClick={logoutUser}>Cerrar sesión</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="dropdown dropdown-end lg:hidden">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle mr-5"
        >
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="badge badge-sm indicator-item">8</span>
          </div>
        </div>
        <div
          tabIndex={0}
          className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
        >
          <div className="card-body">
            <span className="font-bold text-lg">8 Items</span>
            <span className="text-info">Subtotal: $999</span>
            <div className="card-actions">
              <Link to="/cart" className="btn btn-primary btn-block">
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="dropdown dropdown-end lg:hidden">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img alt="Avatar" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to={"/profile"} className="justify-between">
              Perfil
              <span className="badge">New</span>
            </Link>
          </li>
          <li>
            <a>Configuración</a>
          </li>
          <li>
            <button className="btn btn-primary mt-2" onClick={logoutUser}>Cerrar sesión</button>
          </li>
        </ul>
      </div>
      <div className="dropdown dropdown-end lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <span>menu</span>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {navList}
        </ul>
      </div>
    </div>
  );
}
