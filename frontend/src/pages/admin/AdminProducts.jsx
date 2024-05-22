import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import Error from "../error/Error";
import { toast } from "react-hot-toast";
import axios from "axios";

const collectProducts = async (rec, res) => {
  
}
const products = [
  {
    id: 1,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    description:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
    genre: "Disney",
    rating: 2.5,
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    description:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
    genre: "Disney",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    description:
      "Person using a pen to cross a task off a productivity paper card.",
    genre: "Disney",
    rating: 1,
  },
  // More products...
];

export default function AdminProducts() {
  const { user } = useContext(UserContext);
  const [img, setImg] = useState("");
  const [data, setData] = useState({
    productName: "",
    description: "",
    price: 0,
    genre: "",
    image: "",
  });

  const imgbase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const dataImg = new Promise((res, rej) => {
      reader.onload = () => res(reader.result);
      reader.onerror = () => rej(err);
    });
    return dataImg;
  };

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    const image = await imgbase64(file);
    setImg(image);
  };

  const uploadProduct = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Subiendo producto...");

    const { productName, description, price, genre, image } = data;
    try {
      const response = await axios.post("/uploadProduct", {
        productName,
        description,
        price,
        genre,
        image: img,
      });

      if (response.data.error) {
        toast.error(response.data.error, { id: idToast });
      } else {
        setData({});
        toast.success(
          (t) => (
            <span className="text-pretty flex flex-col text-lg">
              {response.data.message}
              <button
                className="btn btn-accent w-[30%] ml-[70%]"
                onClick={() => toast.dismiss(t.id)}
              >
                Descartar
              </button>
            </span>
          ),
          {
            id: idToast,
            duration: 5000,
          }
        );
      }
    } catch (error) {
      toast.error("Error al crear el producto", { id: idToast });
    }
  };

  return (
    <>
      {user && user.role === 1 ? (
        <>
          <div className="flex lg:flex-row max-lg:flex-col-reverse">
            <div className="m-10 lg:w-1/4 min-w-[30%]">
              <h1 className="card-title">Añadir un nuevo producto</h1>
              <form onSubmit={uploadProduct}>
                <TextBoxWithTextOnTop
                  type="text"
                  text="Nombre del producto"
                  placeholder="Nombre de producto..."
                  value={data.productName}
                  onChange={(e) =>
                    setData({ ...data, productName: e.target.value })
                  }
                />
                <label className="form-control w-full mt-4">
                  <div className="label">
                    <span className="label-text">Descripción</span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered h-24 gap-2 bg-primary text-black"
                    placeholder="Descripción del producto..."
                    value={data.description}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  ></textarea>
                </label>
                <TextBoxWithTextOnTop
                  type="number"
                  text="Precio"
                  placeholder="Precio del producto..."
                  value={data.price}
                  onChange={(e) => setData({ ...data, price: e.target.value })}
                />
                <TextBoxWithTextOnTop
                  type="text"
                  text="Género"
                  placeholder="Género del producto..."
                  value={data.genre}
                  onChange={(e) => setData({ ...data, genre: e.target.value })}
                />
                <label className="form-control w-full mt-4">
                  <div className="label">
                    <span className="label-text">Selecciona una imagen</span>
                  </div>
                  <input
                    type="file"
                    onChange={uploadImg}
                    className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                  />
                  <img src={img} className="m-5 shadow" />
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

            <div className="m-10 overflow-y-auto overflow-x-auto overflow-hidden max-h-[650px] max-sm:">
              <table className="text-left font-light text-surface max-w-[85%] min-w-[75%]">
                <caption className="caption-top mb-2">
                  <span className="card-title">
                    {" "}
                    Productos actuales {products.length}
                  </span>
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
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Valoración
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr className="border-b border-base-300 transition duration-300 ease-in-out hover:badge-ghost">
                      <td className=" px-6 py-4 font-medium">{product.id}</td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <img src={product.imageSrc} className="" />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {product.genre}
                      </td>
                      <td className="whitespace px-6 py-4">
                        {product.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {product.price}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {product.rating}
                      </td>
                    </tr>
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
