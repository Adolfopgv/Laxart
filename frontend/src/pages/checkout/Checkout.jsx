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

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

export const Wrapper = () => (
  <Elements stripe={stripePromise} className="p-4 border rounded-lg">
    <Checkout />
  </Elements>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { totalPrice, products } = useContext(CartContext);
  const [button, setButton] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState();
  const [showCardForm, setShowCardForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
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
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const response = await axios.get(`/users/${user._id}/shipping-details`);
        if (response.data && !response.data.error) {
          setShippingDetails(response.data);
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

            // Guardar pedido en base de datos

            // Borrar carrito
            // await axios.delete(`/remove-all-cart/${user._id}`);

            navigate("/order-finished");
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
                  {showEditForm ? (
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextBoxWithTextOnTop
                          text="Nombre"
                          type="text"
                          placeholder="John Doe"
                          value={shippingDetails.name}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              name: e.target.value,
                            })
                          }
                        />
                        <TextBoxWithTextOnTop
                          text="Apellidos"
                          type="text"
                          placeholder="John Doe"
                          value={shippingDetails.surname}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              surname: e.target.value,
                            })
                          }
                        />
                      </div>
                      <TextBoxWithTextOnTop
                        text="Dirección 1"
                        type="text"
                        placeholder="123 Main St, Anytown USA"
                        value={shippingDetails.address1}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            address1: e.target.value,
                          })
                        }
                      />
                      <TextBoxWithTextOnTop
                        text="Dirección 2 (opcional)"
                        type="text"
                        placeholder="123 Main St, Anytown USA"
                        value={shippingDetails.address2}
                        onChange={(e) =>
                          setShippingDetails({
                            ...shippingDetails,
                            address2: e.target.value,
                          })
                        }
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextBoxWithTextOnTop
                          text="País"
                          placeholder="Anytown"
                          type="text"
                          value={shippingDetails.country}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              country: e.target.value,
                            })
                          }
                        />
                        <TextBoxWithTextOnTop
                          text="Provincia"
                          placeholder="CA"
                          type="text"
                          value={shippingDetails.province}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              province: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextBoxWithTextOnTop
                          text="Localidad"
                          type="text"
                          placeholder="12345"
                          value={shippingDetails.locality}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              locality: e.target.value,
                            })
                          }
                        />
                        <TextBoxWithTextOnTop
                          text="Código Postal"
                          type="number"
                          placeholder="United States"
                          value={shippingDetails.postalCode}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        className="btn btn-accent w-full py-2"
                        onClick={() => setShowEditForm(false)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p>
                        <strong>Nombre:</strong> {shippingDetails.name}
                      </p>
                      <p>
                        <strong>Apellidos:</strong> {shippingDetails.surname}
                      </p>
                      <p>
                        <strong>Dirección 1:</strong> {shippingDetails.address1}
                      </p>
                      {shippingDetails.address2 && (
                        <p>
                          <strong>Dirección 2:</strong>{" "}
                          {shippingDetails.address2}
                        </p>
                      )}
                      <p>
                        <strong>País:</strong> {shippingDetails.country}
                      </p>
                      <p>
                        <strong>Provincia:</strong> {shippingDetails.province}
                      </p>
                      <p>
                        <strong>Localidad:</strong> {shippingDetails.locality}
                      </p>
                      <p>
                        <strong>Código Postal:</strong>{" "}
                        {shippingDetails.postalCode}
                      </p>
                      <button
                        className="btn btn-accent w-full py-2 mt-4"
                        onClick={() => setShowEditForm(true)}
                      >
                        Editar
                      </button>
                    </div>
                  )}
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
                      {products?.map((product) => (
                        <div
                          className="flex items-center justify-between"
                          key={product._id}
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
                              <span className="text-sm font-thin">
                                Cantidad: {product.quantity}
                              </span>
                            </div>
                          </div>
                          <span>{product.price}€</span>
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
