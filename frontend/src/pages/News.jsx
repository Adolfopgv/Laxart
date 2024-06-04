import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function News() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filteredProducts = products.filter(
    (product) => new Date(product.createdAt) >= today
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/get-products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al recoger productos: ", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-4xl mb-6">Novedades</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {loading ? (
            renderSkeletons()
          ) : filteredProducts?.length > 0 ? (
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
                <h3 className="mt-4 text-sm text-gray-700">
                  {product.productName}
                </h3>
                <p className="text-xs text-black">{product.genre}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}€
                </p>
                <div className="">
                  {/* <StarRating rating={product.rating} /> */}
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
