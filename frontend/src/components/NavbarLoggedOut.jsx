import { Link } from "react-router-dom";
import TextBoxWithTextOnTop from "./TextBoxWithTextOnTop";

export default function NavbarLoggedOut() {
  function menuTienda(showHide, margin, padding) {
    return (
      <ul className={`menu menu-horizontal ${showHide}`}>
        <li>
          <details className={`flex justify-center ${margin}`}>
            <summary className={`btn btn-ghost ${padding}`}>Tienda</summary>
            <ul className="p-2 bg-accent rounded-t-none">
              <li>
                <Link to="/store" className="btn btn-ghost">
                  Catálogo
                </Link>
              </li>
              <li>
                <a>Link 2</a>
              </li>
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
      <Link to="/login" className="btn btn-outline">
        Iniciar sesión
      </Link>
      <Link to="/register" className="btn bg-base-100">
        Registrarse
      </Link>
    </ul>
  );

  return (
    <div className="navbar bg-accent">
      <div className="flex-1 ml-3">
        <Link to="/" className="btn btn-ghost text-xl text-black">
          Laxart
        </Link>
      </div>

      {/** Icono de busqueda */}
      <div className="mr-2 dropdown dropdown-end lg:hidden">
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
            <form action="">
              <TextBoxWithTextOnTop
                type="text"
                text="Buscar"
                placeholder="Buscar..."
              />
            </form>
          </div>
        </div>
      </div>

      {/**Navbar en forma de menu desplegable para pantallas mas pequeñas */}
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
          {navList}
        </ul>
      </div>

      {/**Navbar normal */}
      <div className="mr-3 flex-none max-lg:hidden lg:flex">{navList}</div>
    </div>
  );
}
