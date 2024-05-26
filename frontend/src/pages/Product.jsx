import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import Error from "./error/Error";
import { Link } from "react-router-dom";

export default function Product() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const product = location.state.product;

  return (
    <>
      {product ? (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
          <div className="grid gap-4">
            <img
              alt={product.productName}
              className="aspect-square object-cover w-full rounded-lg overflow-hidden dark:border-gray-800"
              height={600}
              src={product.image}
              width={600}
            />
          </div>
          <div className="grid gap-4 md:gap-10 items-start">
            <div className="grid gap-4">
              <h1 className="font-bold text-3xl lg:text-4xl">
                {product.productName}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0.5">
                  {product.rating}
                </div>
              </div>
              <div className="text-4xl font-bold">{product.price}€</div>
              <div className="text-lg leading-loose">
                <p>{product.description}</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {user ? (
                  <>
                    <button className="btn btn-accent">
                      Añadir al carrito
                    </button>
                    <button className="btn btn-primary w-[10%]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="15 0 70 101"
                        id="heart"
                      >
                        <path d="M49.7 80.9c.3.1.6.2.9.2.3 0 .6-.1.9-.2C78 70.1 86.9 50.7 84.1 36.2c-1.9-9.8-8.9-16.1-17.8-16.1-5 0-10.4 2-15.7 5.9-5.3-4-10.8-6.1-15.8-6.1-8.9 0-15.9 6.4-17.8 16.2-2.9 14.7 6.1 34.2 32.7 44.8zM21.6 37.1c1.4-7.5 6.6-12.3 13.1-12.3 4.4 0 9.4 2.1 14.3 6.2.9.7 2.1.7 3 0 4.9-4 9.8-6 14.2-6 6.5 0 11.7 4.8 13.1 12.2 2.4 12.4-5.6 29.2-28.8 39-23.2-9.8-31.3-26.6-28.9-39.1z"></path>
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-accent">
                      <Link to="/login">Inicia sesión para comprar</Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
}