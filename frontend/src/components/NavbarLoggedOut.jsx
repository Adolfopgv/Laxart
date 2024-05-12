import { Link } from "react-router-dom";

export default function Navbar() {
  const navList = (
    <ul>
      <Link to="/" className="btn btn-ghost ml-3">
        Inicio
      </Link>
      <Link to="/news" className="btn btn-ghost ml-3">
        Novedades
      </Link>
      <Link to="/store" className="btn btn-ghost ml-3">
        Tienda
      </Link>
      <Link to="/contact" className="btn btn-ghost ml-3">
        Contacto
      </Link>
      <Link to="/about" className="btn btn-ghost ml-3">
        Sobre el proyecto
      </Link>
      <Link to="/login" className="btn btn-outline ml-3">
        Iniciar sesión
      </Link>
      <Link to="/register" className="btn btn-primary ml-3 mt-2">
        Registrarse
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
      <div className="mt-2 mb-4 m-3 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6  max-lg:hidden lg:block">
        {navList}
      </div>
    </div>
  );
}
