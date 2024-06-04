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
          } else {
            setCartProducts([]);
          }
        } catch (error) {
          console.error(error);
          setCartProducts([]);
        }
      };
      fetchCartProducts();
    } else {
      setCartProducts([]);
      setProducts([]);
      setTotalPrice(0);
      setQuantity(0);
    }
  }, [user, cartChanged]);

  useEffect(() => {
    if (user && cartProducts.length > 0) {
      const getProducts = async () => {
        try {
          const productDetails = await Promise.all(
            cartProducts.map(async (cartProduct) => {
              const response = await axios.get(
                `/get-product/${cartProduct.product}`
              );
              if (!response.data.error) {
                return {
                  ...response.data,
                  quantity: cartProduct.quantity,
                  type: cartProduct.type,
                };
              } else {
                return null;
              }
            })
          );

          // FLAG MIRAR FILTER (QUITAR SI HACE FALTA)
          const validProductDetails = productDetails.filter(
            (product) => product !== null
          );

          if (validProductDetails.length > 0) {
            setProducts(validProductDetails);
            const totalQuantity = validProductDetails.reduce(
              (acc, product) => acc + product.quantity,
              0
            );
            setQuantity(totalQuantity);

            const total = validProductDetails.reduce(
              (acc, curr) => acc + Number(curr.price) * curr.quantity,
              0
            );
            setTotalPrice(total);
          } else {
            setProducts([]);
            setTotalPrice(0);
            setQuantity(0);
          }
        } catch (error) {
          console.error(error);
          setProducts([]);
          setTotalPrice(0);
          setQuantity(0);
        }
      };
      getProducts();
    } else {
      setProducts([]);
      setTotalPrice(0);
      setQuantity(0);
    }
  }, [user, cartProducts]);

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
