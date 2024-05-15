import { Link } from "react-router-dom";

export default function NavbarLoggedOut() {
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
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Laxart
        </Link>
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
