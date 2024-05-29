import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./userContext";
import axios from "axios";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const [cartChanged, setCartChanged] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchCartProducts = async () => {
        try {
          const response = await axios.get(`/get-cart-products/${user._id}`);
          if (!response.data.error) {
            setCartProducts(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchCartProducts();
    }
  }, [user, cartChanged]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productDetails = await Promise.all(
          cartProducts.map(async (cartProduct) => {
            const response = await axios.get(
              `/get-product/${cartProduct.product}`
            );
            return { ...response.data, quantity: cartProduct.quantity };
          })
        );

        setProducts(productDetails);

        const totalQuantity = productDetails.reduce(
          (acc, product) => acc + product.quantity,
          0
        );
        setQuantity(totalQuantity);

        const total = productDetails.reduce(
          (acc, curr) => acc + Number(curr.price) * curr.quantity,
          0
        );
        setTotalPrice(total);
      } catch (error) {
        console.error(error);
      }
    };

    getProducts();
  }, [cartProducts]);

  return (
    <CartContext.Provider
      value={{
        cartChanged,
        setCartChanged,
        products,
        totalPrice,
        quantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
