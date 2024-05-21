import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import Error from "../error/Error";

const products = [
  {
    id: 1,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 4,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 5,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  // More products...
];

export default function AdminProducts() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user && user.role === 1 ? (
        <>
          <div className="flex lg:flex-row max-lg:flex-col">
            <div className="m-10 lg:w-2/4">
              <h1 className="card-title">Añadir un nuevo producto</h1>
              <form onSubmit="">
                <TextBoxWithTextOnTop
                  type="text"
                  text="Nombre del producto"
                  placeholder="Nombre de producto..."
                />
                <label className="form-control w-full mt-4">
                  <div className="label">
                    <span className="label-text">Descripción</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-24 gap-2 bg-primary text-black"
                    placeholder="Descripción del producto..."
                  ></textarea>
                </label>
                <TextBoxWithTextOnTop
                  type="number"
                  text="Precio"
                  placeholder="Precio del producto..."
                />
                <TextBoxWithTextOnTop
                  type="text"
                  text="Género"
                  placeholder="Género del producto..."
                />
                <label className="form-control w-full mt-4">
                  <div className="label">
                    <span className="label-text">Selecciona una imagen</span>
                  </div>
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                  />
                  <img src="input" alt="img" />
                </label>
                <button
                  type="submit"
                  className="btn mt-4 mb-4 w-full btn-accent"
                >
                  Añadir producto
                </button>
              </form>
            </div>

            <div className="divider lg:divider-horizontal" />

            <div className="table-fixed m-10 overflow-auto">
              <table className="text-left text-sm font-light text-surface">
                <caption className="caption-top mb-2">
                  <span className="card-title"> Productos actuales</span>
                </caption>
                <thead className="border-b border-accent font-medium">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      #
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Imagen
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Genero
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <>
                      <tr className="border-b border-base-300 transition duration-300 ease-in-out hover:badge-ghost">
                        <td className=" px-6 py-4 font-medium">{product.id}</td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <img src={product.imageSrc} className=""/>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {product.imageAlt}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {product.price}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Error />
      )}
    </>
  );
}
