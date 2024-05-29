import { useState, useContext } from "react";
import { CartContext } from "../context/cartContext";
import TextBoxWithTextOnTop from "../components/TextBoxWithTextOnTop";

export default function Checkout() {
  const { totalPrice } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <div className="card p-4 shadow-lg rounded-lg bg-base-100">
              <div className="card-title">
                <span className="text-3xl">Detalles de envio</span>
              </div>
              <div className="card-body mt-4">
                <div className="grid gap-4">
                  <TextBoxWithTextOnTop text="Nombre" placeholder="John Doe" />
                  <TextBoxWithTextOnTop
                    text="Apellido"
                    placeholder="John Doe"
                  />
                  <TextBoxWithTextOnTop
                    text="Dirección 1"
                    placeholder="123 Main St, Anytown USA"
                  />
                  <TextBoxWithTextOnTop
                    text="Dirección 2"
                    placeholder="123 Main St, Anytown USA"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextBoxWithTextOnTop text="País" placeholder="Anytown" />
                    <TextBoxWithTextOnTop text="Provincia" placeholder="CA" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextBoxWithTextOnTop
                      text="Localidad"
                      placeholder="12345"
                    />
                    <TextBoxWithTextOnTop
                      text="Código Postal"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-4 shadow-lg rounded-lg bg-base-100">
              <div className="card-title">
                <span className="text-3xl">Método de pago</span>
              </div>
              <div className="card-body mt-4">
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />
                    <label htmlFor="card" className="text-lg">
                      Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />
                    <label htmlFor="paypal" className="text-lg">
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="apple"
                      name="payment"
                      value="apple"
                      checked={paymentMethod === "apple"}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />
                    <label htmlFor="apple" className="text-lg">
                      Apple Pay
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="card p-4 shadow-lg rounded-lg bg-base-100">
              <div className="card-title">
                <span className="text-3xl">Resumen del pedido</span>
              </div>
              <div className="card-body mt-4">
                <div className="grid gap-4">
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
                <button className="btn btn-accent w-full py-2 ">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
