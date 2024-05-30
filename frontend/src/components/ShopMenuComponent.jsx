import { Link } from "react-router-dom";
import { memo } from "react";

const ShopMenuComponent = (props) => {
  return (
    <ul className={`menu menu-horizontal ${props.showHide}`}>
      <li>
        <details className={`flex justify-center ${props.margin} z-50`}>
          <summary className={`btn btn-ghost ${props.padding}`}>Tienda</summary>
          <ul className="p-2 bg-accent rounded-t-none">
            <li>
              <Link to="/store/all" className="btn btn-ghost">
                Catálogo
              </Link>
            </li>
            {props.genres.map((genre, index) => (
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
};

export default memo(ShopMenuComponent);
