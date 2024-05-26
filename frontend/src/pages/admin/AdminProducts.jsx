import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import Error from "../error/Error";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function AdminProducts() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState("");
  const [img, setImg] = useState("");
  const [imgEdit, setImgEdit] = useState("");
  const [data, setData] = useState({
    productName: "",
    description: "",
    price: 0,
    genre: "",
    image: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get("/get-products");
      setProducts(data);
    };
    fetchData();
  }, []);

  const startEdit = (product) => {
    setEditProductId(product._id);
    setEditData(product);
  };

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
    setData({ ...data, image });
  };

  const uploadImgEdit = async (e) => {
    const file = e.target.files[0];
    const image = await imgbase64(file);
    setImgEdit(image);
    setEditData({ ...editData, image });
  };

  const uploadProduct = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Subiendo producto...");

    const { productName, description, price, genre, image } = data;
    try {
      const response = await axios.post("/upload-product", {
        productName,
        description,
        price,
        genre,
        image,
      });

      if (response.data.error) {
        toast.error(response.data.error, { id: idToast });
      } else {
        setData({
          productName: "",
          description: "",
          price: 0,
          genre: "",
          image: "",
        });
        setImg("");
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
        setProducts(await axios.get("/get-products"));
      }
    } catch (error) {
      toast.error("Error al subir el producto", { id: idToast });
    }
  };

  const deleteProduct = async (productId) => {
    toast(
      (t) => (
        <span className="text-pretty text-lg flex flex-col">
          ¿Seguro que quiere eliminar este producto?
          <div className="flex flex-row mt-2">
            <button
              className="btn btn-accent w-[30%] ml-10"
              onClick={() => {
                toast.dismiss(t.id);
              }}
            >
              No
            </button>
            <button
              className="btn btn-outline w-[30%] ml-10"
              onClick={async () => {
                toast.dismiss(t.id);
                const idToast = toast.loading("Eliminando producto...");
                try {
                  const response = await axios.delete(
                    `/delete-product/${productId}`
                  );
                  if (response.data.error) {
                    toast.error(response.data.error, { id: idToast });
                  } else {
                    toast.success(response.data.message, { id: idToast });
                    setProducts(await axios.get("/get-products"));
                  }
                } catch (error) {
                  toast.error("Error", { id: idToast });
                }
              }}
            >
              Si
            </button>
          </div>
        </span>
      ),
      { duration: 100000 }
    );
  };

  const editProduct = async () => {
    const idToast = toast.loading("Actualizando producto...");
    try {
      const response = await axios.post(
        `/update-product/${editProductId}`,
        editData
      );
      if (response.data.error) {
        toast.error(response.data.error, { id: idToast });
      } else {
        toast.success(response.data.message, { id: idToast });
        setProducts(await axios.get("/get-products"));
        setEditProductId(null);
      }
    } catch (error) {}
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
                    accept=".jpg,.jpeg,.png"
                    onChange={uploadImg}
                    className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                  />
                  <img src={img} className="m-5 shadow sm:w-2/4" />
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
                    Productos actuales{" "}
                    {products.data ? products.data.length : products.length}
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
                  {products &&
                    products?.data.map((product, index) => (
                      <tr
                        key={product._id}
                        className="border-b border-base-300"
                      >
                        {editProductId === product._id ? (
                          <>
                            <td className="px-6 py-4 font-medium">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <label className="form-control w-full mt-4">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={uploadImgEdit}
                                  className="file-input file-input-bordered file-input-secondary file-input-xs w-36"
                                />
                                <img
                                  src={imgEdit}
                                  alt=""
                                  className="m-5 shadow sm:w-2/4"
                                />
                              </label>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="productName"
                                value={editData.productName}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    productName: e.target.value,
                                  })
                                }
                                className="input input-bordered input-xs"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="genre"
                                value={editData.genre}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    genre: e.target.value,
                                  })
                                }
                                className="input input-bordered input-xs"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <textarea
                                type="text"
                                name="description"
                                value={editData.description}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    description: e.target.value,
                                  })
                                }
                                className="input input-bordered input-xs h-24 p-2"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                name="price"
                                value={editData.price}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    price: e.target.value,
                                  })
                                }
                                className="input input-bordered input-xs"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <button
                                className="btn btn-accent"
                                onClick={editProduct}
                              >
                                Guardar
                              </button>
                              <button
                                className="btn btn-outline mt-2"
                                onClick={() => setEditProductId(null)}
                              >
                                Cancelar
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 font-medium">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="relative w-24">
                                <img src={product.image} className="h-24" />
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {product.productName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {product.genre}
                            </td>
                            <td className="whitespace px-6 py-4">
                              {product.description}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {product.price} €
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {product.rating}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                className="btn btn-ghost mt-1 w-20"
                                onClick={() => deleteProduct(product._id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  id="recyclebin"
                                  viewBox="0 0 101 101"
                                  stroke="pink"
                                  width={40}
                                >
                                  <path d="M82.2 26.2H63.8v-7.3c0-1.3-1.1-2.4-2.4-2.4H39.6c-1.3 0-2.4 1.1-2.4 2.4v7.3H18.8c-1.3 0-2.4 1.1-2.4 2.4 0 1.3 1.1 2.4 2.4 2.4h2.7l6.1 51.5c.1 1.2 1.2 2.1 2.4 2.1h41c1.2 0 2.2-.9 2.4-2.1L79.5 31h2.7c1.3 0 2.4-1.1 2.4-2.4 0-1.4-1.1-2.4-2.4-2.4zm-40.2-5h17v4.9H42v-4.9zm26.8 58.6H32.2L26.3 31h48.4l-5.9 48.8z"></path>
                                  <path d="M42.5 38.8c-1.3 0-2.4 1.1-2.4 2.4v28.9c0 1.3 1.1 2.4 2.4 2.4 1.3 0 2.4-1.1 2.4-2.4V41.2c0-1.3-1.1-2.4-2.4-2.4zM58.5 38.8c-1.3 0-2.4 1.1-2.4 2.4v28.9c0 1.3 1.1 2.4 2.4 2.4 1.3 0 2.4-1.1 2.4-2.4V41.2c0-1.3-1.1-2.4-2.4-2.4z"></path>
                                </svg>
                              </button>
                              <button
                                className="btn btn-ghost mt-1 mb-1 w-20"
                                onClick={() => startEdit(product)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  id="edit"
                                  viewBox="0 0 101 101"
                                  stroke="pink"
                                  width={40}
                                >
                                  <path d="M82.2 79.2H18.8c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h63.4c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4zM16.5 58.2l-.1 11.3c0 .6.2 1.3.7 1.7.5.4 1.1.7 1.7.7l11.3-.1c.6 0 1.2-.3 1.7-.7l38.8-38.8c.9-.9.9-2.5 0-3.4L59.4 17.7c-.9-.9-2.5-.9-3.4 0l-7.8 7.8-31 31c-.5.5-.7 1.1-.7 1.7zm49-27.6L61.1 35l-7.8-7.8 4.4-4.4 7.8 7.8zM21.3 59.2l28.6-28.6 7.8 7.8L29.1 67h-7.8v-7.8z"></path>
                                </svg>
                              </button>
                            </td>
                          </>
                        )}
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
