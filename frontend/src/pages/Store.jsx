import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export default function Store() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/get-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {user ? (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.length > 0 ? (
              products.map((product) => (
                <a key={product._id} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-black">{product.genre}</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {product.price}€
                  </p>
                </a>
              ))
            ) : (
              <p>No se han encontrado productos</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-4xl mb-6">Productos</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.length > 0 ? (
              products.map((product) => (
                <a key={product._id} className="group" >
                  <div  className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7"
                  onClick={() => navigate(`/store/${product.productName}`, {state:{product}})}>
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-black">{product.genre}</p>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {product.price}€
                  </p>
                </a>
              ))
            ) : (
              <p>No se han encontrado productos</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
