import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import laxart_logo from "../assets/icons/laxart_logo.png";

export default function Footer() {
  const { user } = useContext(UserContext);

  const footer = (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <aside>
        <img className="w-24" src={laxart_logo} alt="Logo" />
        <p>
          Laxart Shop
          <br />
          Adults are only kids grown up, anyway.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Empresa</h6>
        <Link to="/about" className="link link-hover">
          Sobre el proyecto
        </Link>
        <Link to="/contact" className="link link-hover">
          Contacto
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terminos y condiciones</a>
      </nav>
    </footer>
  );

  return <>{user ? (user.role !== 1 ? footer : "" ) : (footer)}</>;
}
