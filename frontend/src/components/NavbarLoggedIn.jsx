import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TextBoxWithTextOnTop from "./TextBoxWithTextOnTop";

export default function NavbarLoggedIn({ props }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await axios.get("/get-products");
        const uniqueGenres = [...new Set(response.data.map(product => product.genre))];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error recogiendo los productos:", error);
      }
    };
    getGenres();
  }, []);

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

  function menuTienda(showHide, margin, padding) {
    return (
      <ul className={`menu menu-horizontal ${showHide}`}>
        <li>
          <details className={`flex justify-center ${margin}`}>
            <summary className={`btn btn-ghost ${padding}`}>Tienda</summary>
            <ul className="p-2 bg-accent rounded-t-none">
              <li>
                <Link to="/store/all" className="btn btn-ghost">
                  Catálogo
                </Link>
              </li>
              {genres.map((genre, index) => (
                <li key={index}>
                  <Link to={`/store/${genre}`} className="btn btn-ghost">
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>
      </ul>
    );
  }

  const navList = (
    <ul className="text-primary mt-2 mb-4 m-3 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/" className="btn btn-ghost">
        Inicio
      </Link>
      <Link to="/news" className="btn btn-ghost">
        Novedades
      </Link>
      {/** menu en pantallas normales */}
      {menuTienda("max-lg:hidden lg:flex", "", "pt-4")}
      {/** menu en pantallas pequeñas */}
      {menuTienda("lg:hidden", "ml-9", "pt-3")}
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
            
            {/** Carrito de compra */}
            <div className="mr-1 dropdown dropdown-end">
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
                    stroke="black"
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
                className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-accent shadow"
              >
                <div className="card-body">
                  <span className="font-bold text-lg">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <Link to="/cart" className="btn btn-base-100 btn-block">
                      View cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>{adminNavList}</div>
        )}
      </div>

      {/** Icono de busqueda (Queda mal en mobiles) */}

      {/** Carrito de compra */}
      {user.role !== 1 && <div className="mr-1 dropdown dropdown-end lg:hidden">
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
              stroke="black"
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
          className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-accent shadow"
        >
          <div className="card-body">
            <span className="font-bold text-lg">8 Items</span>
            <span className="text-info">Subtotal: $999</span>
            <div className="card-actions">
              <Link to="/cart" className="btn btn-base-100 btn-block">
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>}

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
