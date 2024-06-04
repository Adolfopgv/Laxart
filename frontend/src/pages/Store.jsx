import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StarRating from "../components/StarRating";
import TextBoxWithTextOnTop from "../components/TextBoxWithTextOnTop";

export default function Store() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");

  const genreFromUrl = location.pathname.split("/")[2];
  const filteredProducts =
    genreFromUrl != "all"
      ? products.filter((product) => product.genre === genreFromUrl)
      : products;

  const renderSkeletons = () => {
    const skeletons = Array.from({ length: 8 });
    return skeletons.map((_, index) => (
      <div key={index} className="flex flex-col gap-4 w-52">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    ));
  };

  const fetchProducts = useCallback(async () => {
    if (productSearch !== "") {
      setLoading(true);
      const response = await axios.get(
        `/get-products-by-query/?query=${productSearch}`
      );
      setProducts(response.data.products);
      setLoading(false);
    } else {
      try {
        const response = await axios.get("/get-products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error recogiendo los productos:", error);
        setLoading(false);
      }
    }
  }, [productSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="pb-6 w-auto max-w-72 flex flex-row">
          <TextBoxWithTextOnTop
            type="text"
            text="Buscar"
            placeholder="Buscar producto..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            eye={
              <>
                {/** icono de busqueda */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </>
            }
          />
        </div>
        <h2 className="text-4xl mb-6">
          {genreFromUrl !== "all" ? genreFromUrl : "Productos"}
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {loading ? (
            renderSkeletons()
          ) : products?.length > 0 ? (
            filteredProducts.map((product) => (
              <a
                key={product._id}
                className="group"
                onClick={() =>
                  navigate(`/store/${product.genre}/${product.productName}`, {
                    state: { product },
                  })
                }
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-base text-gray-700">
                  {product.productName}
                </h3>
                <p className="text-xs text-black">{product.genre}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}€
                </p>
                <div className="">
                  <StarRating rating={product.rating} />
                </div>
              </a>
            ))
          ) : (
            <p>No se han encontrado productos</p>
          )}
        </div>
      </div>
    </>
  );
}
