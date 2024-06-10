import { toast } from "react-hot-toast";
import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/cartContext";
import { UserContext } from "../../context/userContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePublicKey =
  import.meta.env.VITE_APP_NODE_ENV !== "production"
    ? import.meta.env.VITE_APP_STRIPE_TEST_PUBLIC_KEY
    : import.meta.env.VITE_APP_STRIPE_LIVE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

export const Wrapper = () => (
  <Elements stripe={stripePromise} className="p-4 border rounded-lg">
    <Checkout />
  </Elements>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { totalPrice, products, setCartChanged, quantity } =
    useContext(CartContext);
  const [button, setButton] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState();
  const [showCardForm, setShowCardForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    surname: "",
    address1: "",
    address2: "",
    country: "",
    province: "",
    locality: "",
    postalCode: "",
  });
  const [error, setError] = useState({
    name: false,
    surname: false,
    address1: false,
    country: false,
    province: false,
    locality: false,
    postalCode: false,
  });
  const [errorMsg, setErrorMsg] = useState({
    name: "",
    surname: "",
    address1: "",
    country: "",
    province: "",
    locality: "",
    postalCode: "",
  });
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const response = await axios.get(`/users/${user._id}/shipping-details`);
        if (response.data && !response.data.error) {
          setShippingDetails(response.data);
          console.log("shipping Details: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching shipping details:", error);
      }
    };

    fetchShippingDetails();
  }, [user]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    if (paymentMethod === "card") {
      setShowCardForm(true);
      setButton(true);
    } else {
      setShowCardForm(false);
    }
  }, [paymentMethod]);

  const checkoutOrder = async () => {
    setButton(false);
    const idToast1 = toast.loading("Comprobando detalles de envio...");
    const {
      name,
      surname,
      address1,
      address2,
      country,
      province,
      locality,
      postalCode,
    } = shippingDetails;

    try {
      const response = await axios.post(`/users/${user._id}/update-addresses`, {
        name,
        surname,
        address1,
        address2,
        country,
        province,
        locality,
        postalCode,
      });

      if (!response.data.error) {
        const idToast2 = toast.loading(response.data.message, { id: idToast1 });
        setShippingDetails(response.data);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

        if (!error) {
          const { id } = paymentMethod;
          const priceInCents = Math.round(totalPrice * 100);
          const { data } = await axios.post("/checkout-order", {
            id,
            amount: priceInCents,
          });
          elements.getElement(CardElement).clear();
          if (!data.error) {
            toast.success(data.message, { id: idToast2 });

            const response = await axios.post("/register-order", {
              user: user,
              shippingDetails: shippingDetails,
              products: products.map((product) => ({
                productId: product._id,
                productName: product.productName,
                quantity: product.quantity,
                type: product.type,
                price: product.price,
                discount: product.discount,
                image: product.image,
              })),
              totalPrice: totalPrice,
              itemsQuantity: quantity,
            });
            if (!response.data.error) {
              const deleteCart = await axios.delete(
                `/remove-all-cart/${user._id}`
              );

              if (!deleteCart.data.error) {
                setCartChanged((val) => !val);
                navigate("/order-finished");
              }
            }
          } else {
            toast.error(data.error, { id: idToast2 });
            setButton(true);
          }
        } else {
          toast.error("Introduce una tarjeta", { id: idToast2 });
          setButton(true);
        }
      } else {
        toast.error(response.data.error, { id: idToast1 });
        setButton(true);
        switch (response.data.error) {
          case "El nombre es requerido":
            setError({ ...error, name: true });
            setErrorMsg({ ...errorMsg, name: response.data.error });
            break;
          case "El apellido es requerido":
            setError({ ...error, surname: true });
            setErrorMsg({ ...errorMsg, surname: response.data.error });
            break;
          case "La dirección 1 es requerido":
            setError({ ...error, address1: true });
            setErrorMsg({ ...errorMsg, address1: response.data.error });
            break;
          case "La ciudad es requerida":
            setError({ ...error, country: true });
            setErrorMsg({ ...errorMsg, country: response.data.error });
            break;
          case "La provincia es requerida":
            setError({ ...error, province: true });
            setErrorMsg({ ...errorMsg, province: response.data.error });
            break;
          case "La localidad es requerida":
            setError({ ...error, locality: true });
            setErrorMsg({ ...errorMsg, locality: response.data.error });
            break;
          case "El código postal es requerido":
            setError({ ...error, postalCode: true });
            setErrorMsg({ ...errorMsg, postalCode: response.data.error });
            break;
          default:
            setError({
              ...error,
              name: true,
              surname: true,
              address1: true,
              country: true,
              province: true,
              locality: true,
              postalCode: true,
            });
            setErrorMsg({
              ...errorMsg,
              name: response.data.error,
              surname: response.data.error,
              address1: response.data.error,
              country: response.data.error,
              province: response.data.error,
              locality: response.data.error,
              postalCode: response.data.error,
            });
            break;
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setButton(true);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-primary">
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <div className="card p-4 shadow-lg rounded-lg bg-base-100">
                <div className="card-title pt-3 pl-3">
                  <span className="text-3xl">Detalles de envio</span>
                </div>
                <div className="card-body mt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <TextBoxWithTextOnTop
                          text="Nombre"
                          type="text"
                          placeholder="Introduce tu nombre..."
                          value={shippingDetails.name}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              name: e.target.value,
                            });
                            setError({ ...error, name: false });
                          }}
                        />
                        {error.name && (
                          <span className="text-error ml-2 font-bold">
                            {errorMsg.name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <TextBoxWithTextOnTop
                          text="Apellidos"
                          type="text"
                          placeholder="Introduce tu apellido..."
                          value={shippingDetails.surname}
                          onChange={(e) => {
                            setShippingDetails({
                              ...shippingDetails,
                              surname: e.target.value,
                            });
                            setError({ ...error, surname: false });
                          }}
                        />
                        {error.surname && (
                          <span className="text-error ml-2 font-bold">
                            {errorMsg.surname}
                          </span>
                        )}
                      </div>
                    </div>
                    <TextBoxWithTextOnTop
                      text="Dirección 1"
                      type="text"
                      placeholder="Introduce tu dirección..."
                      value={shippingDetails.address1}
                      onChange={(e) => {
                        setShippingDetails({
                          ...shippingDetails,
                          address1: e.target.value,
                        });
                        setError({ ...error, address1: false });
                      }}
                    />
                    {error.address1 && (
                      <span className="text-error ml-2 font-bold">
                        {errorMsg.address1}
                      </span>
                    )}
                    <TextBoxWithTextOnTop
                      text="Dirección 2 (opcional)"
                      type="text"
                      placeholder="Introduce tu dirección..."
                      value={shippingDetails.address2}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          address2: e.target.value,
                        })
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <TextBoxWithTextOnTop
                          text="País"
                          placeholder="Introduce tu país..."
                          type="text"
                          value={shippingDetails.country}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              country: e.target.value,
                            })
                          }
                        />
                        {error.country && (
                          <span className="text-error ml-2 font-bold">
                            {errorMsg.country}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <TextBoxWithTextOnTop
                          text="Provincia"
                          placeholder="Introduce tu provincia..."
                          type="text"
                          value={shippingDetails.province}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              province: e.target.value,
                            })
                          }
                        />
                        {error.province && (
                          <span className="text-error ml-2 font-bold">
                            {errorMsg.province}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <TextBoxWithTextOnTop
                          text="Localidad"
                          type="text"
                          placeholder="Introduce tu localidad..."
                          value={shippingDetails.locality}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              locality: e.target.value,
                            })
                          }
                        />
                        {error.locality && (
                          <span className="text-error ml-2 font-bold">
                            {errorMsg.locality}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <TextBoxWithTextOnTop
                          text="Código Postal"
                          type="number"
                          placeholder="Introduce tu código postal..."
                          value={shippingDetails.postalCode}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              postalCode: e.target.value,
                            })
                          }
                        />
                        {error.postalCode && (
                          <span className="text-error ml-2 font-bold">
                            {errorMsg.postalCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-4 shadow-lg rounded-lg bg-base-100">
                <div className="card-title pt-3 pl-3">
                  <span className="text-3xl">Método de pago</span>
                </div>
                <div className="card-body mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-accent"
                          : "border-black"
                      }`}
                      onClick={() => handlePaymentMethodChange("card")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 101 101"
                        className="w-16 h-16 mx-auto mb-2"
                      >
                        <path d="M38.6 51.9h-7.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h7.9c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4z"></path>
                        <path d="M82.2 26.7H18.9c-1.3 0-2.4 1.1-2.4 2.4v15c0 .2-.1.3-.1.5s0 .4.1.5v26.7c0 1.3 1.1 2.4 2.4 2.4h63.4c1.3 0 2.4-1.1 2.4-2.4V29.1c-.1-1.3-1.2-2.4-2.5-2.4zm-2.4 4.8v10.7H21.3V31.5h58.5zm-58.5 38V47.1h58.6v22.4H21.3z"></path>
                      </svg>
                      <p className="text-center text-lg">Tarjeta</p>
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <div
                      className={`mt-4 transition-opacity duration-500 ease-in-out ${
                        showCardForm ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <CardElement className="w-full h-full bg-gray-100 border border-gray-300 rounded-lg p-4 focus:outline-none focus:border-accent" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="sticky top-8 card p-4 shadow-lg rounded-lg bg-base-100">
                <div className="card-title pt-3 pl-3">
                  <span className="text-3xl">Resumen del pedido</span>
                </div>
                <div className="card-body mt-4">
                  <div className="grid gap-4">
                    <div className="flex flex-col">
                      {products?.map((product, index) => (
                        <div
                          className="flex items-center justify-between"
                          key={[product._id, index]}
                        >
                          <div className="flex flex-row">
                            <img
                              alt={product.productName}
                              className="rounded-lg object-cover m-1"
                              height={120}
                              src={product.image}
                              style={{
                                aspectRatio: "120/120",
                                objectFit: "cover",
                              }}
                              width={75}
                            />
                            <div className="flex flex-col ml-2 justify-center">
                              <span className="font-normal">
                                {product.productName}
                              </span>
                              <span className="font-thin">{product.type}</span>
                              <span className="text-sm font-thin">
                                Cantidad: {product.quantity}
                              </span>
                            </div>
                          </div>
                          <span>
                            {(product.price * product.quantity).toFixed(2)}€
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total productos</span>
                      <span className="font-medium">
                        {totalPrice.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Envío</span>
                      <span className="font-medium">0.00€</span>
                    </div>
                    <div className="divider" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>{totalPrice.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    className="btn btn-accent w-full py-2 disabled"
                    onClick={() => checkoutOrder()}
                    disabled={!button}
                  >
                    Pagar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Checkout;
