import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TextBoxWithTextOnTop from "./TextBoxWithTextOnTop";
import ShopMenuComponent from "./ShopMenuComponent";
import ShoppingCartComponent from "./ShoppingCartComponent";

export default function NavbarLoggedIn({ genres }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

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
    <ul className="text-primary mt-2 mb-4 m-3 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/" className="btn btn-ghost">
        Inicio
      </Link>
      <Link to="/news" className="btn btn-ghost">
        Novedades
      </Link>
      {/** menu catalogo */}
      <ShopMenuComponent
        showHide="lg:flex "
        margin="max-lg:ml-9"
        padding="lg:pt-4 max-lg:pt-3"
        genres={genres}
      />

      {/** icono de busqueda */}
      <div className="mr-1 dropdown dropdown-end max-lg:hidden lg:block">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div
          tabIndex={0}
          className="z-[1] card card-compact dropdown-content w-52 bg-accent shadow"
        >
          <div className="card-body">
            <TextBoxWithTextOnTop
              type="text"
              text="Buscar"
              placeholder="Buscar..."
            />
          </div>
        </div>
      </div>
    </ul>
  );

  const adminNavList = (
    <ul className="text-primary mt-2 mb-4 m-3 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/admin-dashboard" className="btn btn-ghost">
        Panel de inicio
      </Link>
      <Link to="/admin-dashboard/products" className="btn btn-ghost">
        Productos
      </Link>
      <Link to="/admin-dashboard/orders" className="btn btn-ghost">
        Pedidos
      </Link>
      <Link to="/admin-dashboard/customers" className="btn btn-ghost">
        Clientes
      </Link>
      <Link to="/admin-dashboard/statistics" className="btn btn-ghost">
        Estadísticas
      </Link>
    </ul>
  );

  return (
    <div className="navbar bg-accent">
      <div className="flex-1 ml-3">
        <Link to="/" className="text-black btn btn-ghost text-xl">
          Laxart
        </Link>
      </div>

      {/**Navbar para pantallas mas grandes  */}
      <div className="flex-none max-lg:hidden lg:flex">
        {user.role !== 1 ? (
          <>
            <div>{navList}</div>
          </>
        ) : (
          <div>{adminNavList}</div>
        )}
      </div>

      {/** Icono de busqueda (Queda mal en mobiles) */}

      {/** Carrito de compra */}
      {user.role !== 1 && <ShoppingCartComponent />}

      {/**Avatar desplegable */}
      <div className="mr-4 dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img src={user.avatar} alt="Avatar" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="text-primary menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-accent rounded-box w-52"
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
            <button className="btn btn-base-100 mt-2" onClick={logoutUser}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {/**Navbar en menu desplegable para pantallas pequeñas*/}
      <div className="mr-5 dropdown dropdown-end lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          {/* hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-accent rounded-box w-52"
        >
          {user.role !== 1 ? navList : adminNavList}
        </ul>
      </div>
    </div>
  );
}
