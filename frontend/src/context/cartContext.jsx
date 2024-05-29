import { createContext, useState } from "react";

export const CartContext = createContext({
  productAdded: false,
  setProductAdded: () => {},
});

export function CartContextProvider({ children }) {
  const [productAdded, setProductAdded] = useState(false);
  return (
    <CartContext.Provider value={{ productAdded, setProductAdded }}>
      {children}
    </CartContext.Provider>
  );
}
