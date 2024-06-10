import { Link } from "react-router-dom";
import laxart_logo from "../../assets/icons/laxart_logo.png";

export default function OrderFinished() {
  return (
    <div className="min-h-screen flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-200 rounded-xl">
          <div className="py-24 px-10 flex flex-col items-center gap-24">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              ¡Pedido realizado! ¡Gracias!
            </h2>
            <Link to="/store/all" className="btn btn-accent w-60">
              Volver a la tienda
            </Link>
          </div>
          <div className="flex items-center">
            <img src={laxart_logo} alt="logo clara" />
          </div>
        </div>
      </div>
    </div>
  );
}
