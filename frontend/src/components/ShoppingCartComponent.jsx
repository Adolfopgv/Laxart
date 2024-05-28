import { Link } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import axios from "axios";

const ShoppingCartComponent = ({ cartProducts }) => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productIds = cartProducts.map((cartProduct) => cartProduct._id);
        const productDetails = await Promise.all(
          productIds.map(async (productId) => {
            const response = await axios.get(`/get-product/${productId}`);
            return response.data;
          })
        );

        const productMap = productDetails.reduce((acc, product) => {
          if (!acc[product._id]) {
            acc[product._id] = { ...product, quantity: 1 };
          } else {
            acc[product._id].quantity += 1;
          }
          //   setQuantity(acc[product._id].quantity);
          return acc;
        }, {});

        const uniqueProducts = Object.values(productMap);

        setProducts(uniqueProducts);

        const total = uniqueProducts.reduce(
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

  const deleteCartProduct = () => {};

  return (
    <div className="mr-1 dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle mr-5">
        <div className="indicator">
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="badge badge-sm indicator-item">{quantity}</span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="mt-3 z-[1] card card-compact dropdown-content w-72 bg-accent shadow"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{products.length} Productos</span>
          <span className="text-black">Total: {totalPrice}€</span>
          <div className="card-actions overflow-auto max-h-96">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-row items-center mb-2"
              >
                <img src={product.image} className="w-16 h-16 mr-3" />
                <div className="flex flex-col text-primary">
                  <span>{product.productName}</span>
                  <span>{product.price * product.quantity} €</span>
                  <span>Cantidad: {product.quantity}</span>
                </div>
                <button
                  className="btn btn-ghost ml-4 flex items-center justify-center"
                  onClick={() => deleteCartProduct()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 101 101"
                    id="cancel"
                    className="h-6 w-6"
                  >
                    <path d="M50.5 84.6c18.8 0 34.1-15.3 34.1-34.1S69.3 16.4 50.5 16.4 16.4 31.7 16.4 50.5s15.3 34.1 34.1 34.1zm0-63.4c16.1 0 29.3 13.1 29.3 29.3S66.6 79.8 50.5 79.8 21.2 66.6 21.2 50.5s13.2-29.3 29.3-29.3z"></path>
                    <path d="M37.7 63c.5.5 1.1.7 1.7.7s1.2-.2 1.7-.7l9.4-9.4 9.4 9.4c.5.5 1.1.7 1.7.7s1.2-.2 1.7-.7c.9-.9.9-2.5 0-3.4l-9.4-9.4 9.4-9.4c.9-.9.9-2.5 0-3.4s-2.5-.9-3.4 0l-9.4 9.4-9.4-9.4c-.9-.9-2.5-.9-3.4 0s-.9 2.5 0 3.4l9.4 9.4-9.4 9.4c-.9.9-.9 2.4 0 3.4z"></path>
                  </svg>
                </button>
              </div>
            ))}
            <Link to="/cart" className="btn btn-base-100 btn-block">
              Ver carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ShoppingCartComponent);
