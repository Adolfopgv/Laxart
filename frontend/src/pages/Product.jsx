import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import Error from "./error/Error";
import { Link } from "react-router-dom";

export default function Product() {
  const { user } = useContext(UserContext);
  const { setCartChanged } = useContext(CartContext);
  const location = useLocation();
  const product = location.state?.product;
  const [type, setType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [typeError, setTypeError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(`/get-reviews/${product._id}`);

      if (!response.data.error) {
        setReviews(response.data);
        console.log(response.data);
      }
    };
    fetchReviews();
  }, []);

  const addToCart = async () => {
    try {
      if (type !== "") {
        setTypeError(false);
        const response = await axios.post(
          `/add-to-cart/${user._id}/${product._id}`,
          {
            type: type,
          }
        );
        console.error(response.data.error);
        if (!response.data.error) {
          toast.success(response.data.message);
          setCartChanged((val) => !val);
        } else {
          toast.error(response.data.error);
        }
      } else {
        toast.error("Debes elegir un tipo primero");
        setTypeError(true);
      }
    } catch (error) {
      toast.error(error.response.data.error);
      console.error(error);
    }
  };

  const addReview = async () => {
    const idToast = toast.loading("Subiendo reseña...");
    try {
      const response = await axios.post(
        `/add-review/${user._id}/${product._id}`,
        {
          review: reviewText,
        }
      );
      if (!response.data.error) {
        toast.success(response.data.message, { id: idToast });
        setReviewText("");
      } else {
        toast.error(response.data.error, { id: idToast });
      }
    } catch (error) {
      toast.error("Error del servidor", { id: idToast });
    }
  };

  return (
    <>
      {product ? (
        <>
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
                <div className="text-4xl font-bold">{product.price}€</div>
                <div className="flex flex-row items-center">
                  <span className="text-xl font-bold">Tipo: </span>
                  <details
                    className="dropdown"
                    open={(dropdownOpen) => !dropdownOpen}
                  >
                    <summary
                      className={`m-1 btn ${
                        typeError ? "bg-error" : "bg-white"
                      }`}
                    >
                      {type ? type : typeError ? "¡Elije un tipo!" : "Tipo"}
                    </summary>
                    <ul className="p-2 shadow menu dropdown-content z-[1] bg-white rounded-box w-52">
                      {product.types.map((type) => {
                        return (
                          <li
                            key={type}
                            onClick={() => {
                              setType(type);
                              setDropdownOpen(!dropdownOpen);
                              setTypeError(false);
                            }}
                          >
                            <a>{type}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </div>
                <div className="text-lg leading-loose">
                  <p>{product.description}</p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {user ? (
                    <>
                      <button
                        className="btn btn-accent"
                        onClick={() => addToCart()}
                      >
                        Añadir al carrito
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
          <div className="w-full mx-auto max-w-6xl px-4 py-6">
            <h2 className="text-3xl font-bold mb-4">Reseñas</h2>
            <div className="border border-base-200 p-4 rounded">
              {reviews.length > 0 ? (
                <>
                  {reviews.map((review, index) => (
                    <div key={index} className="mb-4 border-b border-base-300">
                      <p className="text-lg font-semibold">{review.username}</p>
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                  ))}
                </>
              ) : (
                <span>No hay reseñas para este producto</span>
              )}

              {user && (
                <div className="mt-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Escribe tu reseña aquí..."
                    rows={4}
                    className="w-full border border-base-300 rounded p-2 focus:outline-none focus:border-accent"
                  ></textarea>
                  <button onClick={addReview} className="mt-2 btn btn-accent">
                    Enviar reseña
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <Error />
      )}
    </>
  );
}
