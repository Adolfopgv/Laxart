import React from "react";
import banner_inicio from "../assets/banner_inicio.png";
import img1 from "../assets/modelos_venta/modelo_scar.jpg";
import imgNov1 from "../assets/modelos_venta/modelo_1928.jpg";
import imgNov2 from "../assets/modelos_venta/modelo_melody.jpg";
import imgNov3 from "../assets/modelos_venta/modelo_patricio.jpg";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <img src={banner_inicio} alt="banner" className="" />
        <main>
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Descubre nuestra colección de joyas artesanales con temática
                    friki
                  </h1>
                  <p className="text-gray-500 md:text-lg">
                    Desde anillos inspirados en tus personajes favoritos hasta
                    pendientes con detalles geek, tenemos algo para cada
                    fanático.
                  </p>
                  <div className="flex gap-4">
                    <Link to="/store/all" className="btn btn-accent">
                      Explorar Colección
                    </Link>
                    <Link to="/about" className="btn btn-outline">Más Información</Link>
                  </div>
                </div>
                <div className="hidden md:block">
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
                  <div className="card blur-2xl">
                    <img
                      src={imgNov1}
                      width={400}
                      height={300}
                      alt="Anillo Zelda"
                      className="rounded-t-lg object-cover"
                    />
                    <div className="card-body">
                      <h3 className="text-xl font-bold">Un producto</h3>
                      <p className="text-gray-500">
                        Descripción del producto
                      </p>
                    </div>
                  </div>
                  <div className="card blur-2xl">
                    <img
                      src={imgNov2}
                      width={400}
                      height={300}
                      alt="Collar Hogwarts"
                      className="rounded-t-lg object-cover"
                    />
                    <div className="card-body">
                      <h3 className="text-xl font-bold">Otro producto</h3>
                      <p className="text-gray-500">
                        Descripción del producto
                      </p>
                    </div>
                  </div>
                  <div className="card blur-2xl">
                    <img
                      src={imgNov3}
                      width={400}
                      height={300}
                      alt="Aretes Pokémon"
                      className="rounded-t-lg object-cover"
                    />
                    <div className="card-body">
                      <h3 className="text-xl font-bold">Otro más</h3>
                      <p className="text-gray-500">
                        Descripción de otro producto
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
