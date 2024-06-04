import { Link } from "react-router-dom";
import { memo, useState } from "react";

const ShopMenuComponent = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ul className={`menu menu-horizontal ${props.showHide}`}>
      <li>
        <details
          className={`flex justify-center ${props.margin} z-50`}
          open={(menuOpen) => !menuOpen}
        >
          <summary className={`btn btn-ghost ${props.padding}`}>Tienda</summary>
          <ul className="p-2 bg-accent rounded-t-none">
            <li onClick={() => setMenuOpen(!menuOpen)}>
              <Link to="/store/all" className="btn btn-ghost">
                Catálogo
              </Link>
            </li>
            {props.genres.map((genre, index) => (
              <li key={index} onClick={() => setMenuOpen(!menuOpen)}>
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
};

export default memo(ShopMenuComponent);
