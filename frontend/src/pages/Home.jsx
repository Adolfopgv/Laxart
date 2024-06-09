import { useState, useEffect } from "react";
import axios from "axios";
import banner_inicio from "../assets/banner_inicio.jpg";
import img1 from "../assets/modelos_venta/modelo_scar.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <main>
        <img src={banner_inicio} alt="banner" className="w-full" />
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Descubre una gran colección de accesorios artesanales frikis
                </h1>
                <p className="text-gray-500 md:text-lg">
                  Modelos inspirados en tus animes favoritos, películas y series
                  de tu infancia e incluso los videojuegos más queridos ¡Hay
                  temáticas para cada fan!
                </p>
                <div className="flex gap-4">
                  <Link to="/store/all" className="btn btn-accent">
                    Explorar Colección
                  </Link>
                  <Link to="/about" className="btn btn-outline">
                    Más Información
                  </Link>
                </div>
              </div>
              <div className="block">
                <img
                  src={img1}
                  width={600}
                  height={400}
                  alt="Joyas Fandom"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Novedades
                </h2>
                <p className="text-gray-500 md:text-lg">
                  Echa un vistazo a los últimos lanzamientos
                </p>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer rounded-xl"
                onClick={() => navigate("/news")}
              >
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="card blur-2xl hover:blur-none">
                      <img
                        src={filteredProducts[0]?.image}
                        width={400}
                        height={300}
                        alt={filteredProducts[0]?.productName}
                        className="rounded-t-lg object-cover"
                      />
                      <div className="card-body">
                        <h3 className="text-xl font-bold">
                          {filteredProducts[0]?.productName}
                        </h3>
                        <p className="text-gray-500">
                          {filteredProducts[0]?.description}
                        </p>
                      </div>
                    </div>
                    {filteredProducts.length > 1 && (
                      <div className="card blur-2xl hover:blur-none">
                        <img
                          src={filteredProducts[1]?.image}
                          width={400}
                          height={300}
                          alt=""
                          className="rounded-t-lg object-cover"
                        />
                        <div className="card-body">
                          <h3 className="text-xl font-bold">
                            {filteredProducts[1]?.productName}
                          </h3>
                          <p className="text-gray-500">
                            {filteredProducts[1]?.description}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="bg-base-300 rounded w-400 h-300 flex items-center blur hover:blur-none">
                      <span className="text-3xl pl-10">Ver mas...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span>No hay productos nuevos</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
