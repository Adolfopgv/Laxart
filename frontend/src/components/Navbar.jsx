import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import NavBarLoggedIn from "./NavbarLoggedIn";
import NavBarLoggedOut from "./NavbarLoggedOut";
import axios from "axios";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const [genres, setGenres] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await axios.get("/get-products");
        const uniqueGenres = [
          ...new Set(response.data.map((product) => product.genre)),
        ];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error recogiendo los productos:", error);
      }
    };
    getGenres();
  }, []);

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
  }, [user]);

  return (
    <>
      {user ? (
        <NavBarLoggedIn genres={genres} cartProducts={cartProducts} />
      ) : (
        <NavBarLoggedOut genres={genres} />
      )}
    </>
  );
}
