import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import { Link } from "react-router-dom";
import Error from "./error/Error";
import axios from "axios";
import toast from "react-hot-toast";

export default function Cart() {
  const { user } = useContext(UserContext);
  const { setCartChanged, products, quantity, totalPrice } =
    useContext(CartContext);

  const deleteCartProduct = async (productId, productType) => {
    const idToast = toast.loading("Quitando producto del carrito...");

    try {
      const response = await axios.delete(
        `/remove-from-cart/${user._id}/${productId}`,
        {
          type: productType,
        }
      );

      if (!response.data.error) {
        toast.success(response.data.message, { id: idToast });
        setCartChanged((val) => !val);
      } else {
        toast.error(response.data.error, { id: idToast });
      }
    } catch (error) {}
  };

  const addCartProduct = async (productId, productType) => {
    const idToast = toast.loading("Añadiendo producto al carrito...");

    try {
      const response = await axios.post(
        `/add-to-cart/${user._id}/${productId}`,
        {
          type: productType,
        }
      );
      if (!response.data.error) {
        toast.success(response.data.message, { id: idToast });
        setCartChanged((val) => !val);
      } else {
        toast.error(response.data.error, { id: idToast });
      }
    } catch (error) {
      toast.error("Error del servidor", { id: idToast });
    }
  };

  return (
    <>
      {user ? (
        <div className="flex flex-col m-16">
          <h1 className="text-3xl m-5">{quantity} Productos</h1>
          {products.length > 0 ? (
            products.map((product, index) => (
              <div className="flex flex-col" key={[product._id, index]}>
                <div className="flex flex-row lg:items-center gap-4 border-b p-5 border-secondary max-lg:flex-col">
                  <img
                    alt={product.productName}
                    className="rounded-lg object-cover"
                    height={120}
                    src={product.image}
                    style={{
                      aspectRatio: "120/120",
                      objectFit: "cover",
                    }}
                    width={120}
                  />
                  <div className="flex flex-col gap-1 mr-16">
                    <h3 className="font-medium">{product.productName}</h3>
                    <span>{product.type}</span>
                    <p className="text-sm tex-black">{product.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-4 ml-auto">
                    <div className="flex flex-row items-center gap-2">
                      {/** Boton restar */}
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          deleteCartProduct(product._id, product.type)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 101 101"
                          id="remove"
                          className="w-6 h-6"
                        >
                          <path d="M50.5 16.4c-18.8 0-34.1 15.3-34.1 34.1s15.3 34.1 34.1 34.1 34.1-15.3 34.1-34.1-15.3-34.1-34.1-34.1zm0 63.4c-16.1 0-29.3-13.1-29.3-29.3s13.1-29.3 29.3-29.3 29.3 13.1 29.3 29.3-13.2 29.3-29.3 29.3z"></path>
                          <path d="M66.2 47.8H34.8c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h31.4c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4z"></path>
                        </svg>
                      </button>
                      <span>{product.quantity}</span>
                      {/** Boton sumar */}
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          addCartProduct(product._id, product.type)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 101 101"
                          id="add"
                          className="w-6 h-6"
                        >
                          <path d="M50.5 16.4c-18.8 0-34.1 15.3-34.1 34.1s15.3 34.1 34.1 34.1 34.1-15.3 34.1-34.1-15.3-34.1-34.1-34.1zm0 63.4c-16.1 0-29.3-13.1-29.3-29.3s13.1-29.3 29.3-29.3c16.1 0 29.3 13.1 29.3 29.3S66.6 79.8 50.5 79.8z"></path>
                          <path d="M66.2 47.8H52.9V34.5c0-1.3-1.1-2.4-2.4-2.4-1.3 0-2.4 1.1-2.4 2.4v13.3H34.8c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h13.3v13.3c0 1.3 1.1 2.4 2.4 2.4 1.3 0 2.4-1.1 2.4-2.4V52.6h13.3c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="text-lg font-bold">
                      {(product.price * product.quantity).toFixed(2)}€
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="text-lg m-5">
              No hay productos, vuelva a la tienda para añadir algún producto al
              carrito
            </span>
          )}
          <div className="flex items-center justify-between border-t pt-4 border-accent">
            <p className="text-lg font-medium m-10">Total:</p>
            <p className="text-2xl font-bold m-10">{totalPrice.toFixed(2)}€</p>
          </div>
          <div className="flex flex-col-reverse gap-4 mt-4 md:flex-row md:justify-end">
            <Link to="/store/all" className="w-full md:w-auto btn btn-outline">
              Volver a la tienda
            </Link>
            <Link
              to="/checkout"
              className={`w-full md:w-auto btn btn-accent ${
                products.length === 0 ? "btn-disabled" : ""
              }`}
            >
              Comprar
            </Link>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
}
