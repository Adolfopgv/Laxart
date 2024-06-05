import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import TextBoxWithTextOnTop from "../components/TextBoxWithTextOnTop";
import axios from "axios";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, loading, setChange } = useContext(UserContext);
  const [passwordEye, setPasswordEye] = useState(false);
  const [newPasswordEye, setNewPasswordEye] = useState(false);
  const [repeatNewPasswordEye, setRepeatNewPasswordEye] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState("");
  const [repeatNewPasswordError, setRepeatNewPasswordError] = useState(false);
  const [repeatNewPasswordErrorMsg, setRepeatNewPasswordErrorMsg] =
    useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [username, setUsername] = useState("");
  const [userError, setUserError] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [img, setImg] = useState("");
  const fileInputRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderState, setOrderState] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user) {
          const response = await axios.get(`/get-orders/${user._id}`);

          if (!response.data.error) {
            setOrders(response.data);
          } else {
            console.log(response.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [loading, orderState]);

  const handlePasswordShow = () => {
    setPasswordEye(!passwordEye);
  };

  const handleNewPasswordShow = () => {
    setNewPasswordEye(!newPasswordEye);
  };

  const handleRepeatNewPasswordShow = () => {
    setRepeatNewPasswordEye(!repeatNewPasswordEye);
  };

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    const image = await imgbase64(file);
    setImg(image);
    setImgError(false);
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

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const openModal = (order) => {
    setCurrentOrder(order);
    document.getElementById("my_modal_1").showModal();
  };

  const changeOrderState = async (orderId, state) => {
    const toastId = toast.loading("Cambiando estado...");

    try {
      const changeState = await axios.post(`/change-order-state/${orderId}`, {
        orderState: state,
      });

      if (!changeState.data.error) {
        toast.success(changeState.data.message, { id: toastId });
        setOrderState((val) => !val);
      } else {
        toast.error(changeState.data.error, { id: toastId });
      }
    } catch (error) {
      toast.error("Error al cambiar el estado del pedido", { id: toastId });
    }
  };

  const changeAvatar = async () => {
    if (img) {
      const toastId = toast.loading("Cambiando avatar...");
      try {
        const changeAvatar = await axios.post(
          `/users/${user._id}/change-avatar`,
          {
            avatar: img,
          }
        );

        if (!changeAvatar.data.error) {
          toast.success(changeAvatar.data.message, { id: toastId });
          setImg("");
          setChange((val) => !val);
          setImgError(false);
        } else {
          toast.error(changeAvatar.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Por favor selecciona una imagen");
      setImgError(true);
    }
  };

  const changeUsername = async () => {
    const toastId = toast.loading("Cambiando nombre de usuario...");
    try {
      const changeUsername = await axios.post(
        `/users/${user._id}/change-username`,
        {
          username: username,
        }
      );

      if (!changeUsername.data.error) {
        toast.success(changeUsername.data.message, { id: toastId });
        setChange((val) => !val);
        setUsername("");
      } else {
        toast.error(changeUsername.data.error, { id: toastId });
        setUserError(true);
        setUserErrorMessage(changeUsername.data.error);
      }
    } catch (error) {
      toast.error("Error del servidor", { id: toastId });
      console.error("Error en front ChangeUsername: ", error);
    }
  };

  const changePassword = async () => {
    const toastId = toast.loading("Cambiando contraseña...");
    try {
      const changePassword = await axios.post(
        `/users/${user._id}/change-password`,
        {
          actualPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          repeatNewPassword: passwords.repeatNewPassword,
        }
      );
      if (!changePassword.data.error) {
        toast.success(changePassword.data.message, { id: toastId });
        setChange((val) => !val);
        setPasswords({
          currentPassword: "",
          newPassword: "",
          repeatNewPassword: "",
        });
      } else {
        toast.error(changePassword.data.error, { id: toastId });
        switch (changePassword.data.error) {
          case "Debes rellenar todos los campos de contraseña":
            setPasswordError(true);
            setNewPasswordError(true);
            setRepeatNewPasswordError(true);
            setPasswordErrorMessage(changePassword.data.error);
            setNewPasswordErrorMsg(changePassword.data.error);
            setRepeatNewPasswordErrorMsg(changePassword.data.error);
            break;
          case "Debes escribir tu contraseña actual":
            setPasswordError(true);
            setPasswordErrorMessage(changePassword.data.error);
            break;
          case "Debes escribir una contraseña nueva y debe tener al menos 6 caracteres":
            setNewPasswordError(true);
            setNewPasswordErrorMsg(changePassword.data.error);
            break;
          case "Debes repetir la contraseña nueva":
            setRepeatNewPasswordError(true);
            setRepeatNewPasswordErrorMsg(changePassword.data.error);
            break;
          case "Las contraseñas no coinciden":
            setNewPasswordError(true);
            setRepeatNewPasswordError(true);
            setNewPasswordErrorMsg(changePassword.data.error);
            setRepeatNewPasswordErrorMsg(changePassword.data.error);
          case "La contraseña debe contener al menos una mayúscula, una minúscula y un número":
            setNewPasswordError(true);
            setNewPasswordErrorMsg(changePassword.data.error);
            break;
          case "La contraseña actual es erronea":
            setPasswordError(true);
            setPasswordErrorMessage(changePassword.data.error);
            break;
        }
      }
    } catch (error) {
      console.error("Error front changePassword: ", error);
    }
  };

  return (
    <>
      {!!user && (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="card-title">
                <span className="text-2xl">¡Hola, {user.username}!</span>
              </div>
              <div
                className="h-24 w-24 rounded-full overflow-hidden cursor-pointer hover:bg-gray-500"
                onClick={handleAvatarClick}
              >
                <img
                  src={img ? img : user.avatar}
                  alt={user.username}
                  className="object-cover w-full h-full"
                />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  ref={fileInputRef}
                  onChange={uploadImg}
                />
              </div>
              <button
                className={`btn w-auto ${
                  imgError ? "btn-error" : "btn-outline"
                }`}
                onClick={() => changeAvatar()}
              >
                {imgError ? "Debes elegir una imagen" : "Cambiar avatar"}
              </button>
            </div>
            <div className="grid gap-6">
              <div className="card border border-base-200 rounded-lg shadow-sm">
                <div className="card-title px-4 py-2 bg-base-200 border-b border-base-300 rounded-t-lg">
                  <span className="text-lg font-semibold">
                    Cambiar contraseña
                  </span>
                </div>
                <div className="card-body p-4 grid gap-4">
                  <div className="grid gap-2">
                    <TextBoxWithTextOnTop
                      text="Contraseña actual"
                      type={passwordEye ? "text" : "password"}
                      placeholder="Contraseña actual..."
                      value={passwords.currentPassword}
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        });
                        setPasswordError(false);
                      }}
                      eye={
                        <div className="cursor-pointer">
                          {passwordEye === false ? (
                            <AiFillEyeInvisible onClick={handlePasswordShow} />
                          ) : (
                            <AiFillEye onClick={handlePasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {passwordError && (
                      <span className="text-red-500 ml-2 font-bold">
                        {passwordErrorMessage}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <TextBoxWithTextOnTop
                      text="Nueva contraseña"
                      type={newPasswordEye ? "text" : "password"}
                      placeholder="Nueva contraseña..."
                      value={passwords.newPassword}
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        });
                        setNewPasswordError(false);
                      }}
                      eye={
                        <div className="cursor-pointer">
                          {newPasswordEye === false ? (
                            <AiFillEyeInvisible
                              onClick={handleNewPasswordShow}
                            />
                          ) : (
                            <AiFillEye onClick={handleNewPasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {newPasswordError && (
                      <span className="text-red-500 ml-2 font-bold">
                        {newPasswordErrorMsg}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <TextBoxWithTextOnTop
                      text="Repetir nueva contraseña"
                      type={repeatNewPasswordEye ? "text" : "password"}
                      placeholder="Repite nueva contraseña..."
                      value={passwords.repeatNewPassword}
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          repeatNewPassword: e.target.value,
                        });
                        setRepeatNewPasswordError(false);
                      }}
                      eye={
                        <div className="cursor-pointer">
                          {newPasswordEye === false ? (
                            <AiFillEyeInvisible
                              onClick={handleRepeatNewPasswordShow}
                            />
                          ) : (
                            <AiFillEye onClick={handleRepeatNewPasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {repeatNewPasswordError && (
                      <span className="text-red-500 ml-2 font-bold">
                        {repeatNewPasswordErrorMsg}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-accent mr-auto w-full"
                    onClick={() => {
                      changePassword();
                      setPasswordError(false);
                      setNewPasswordError(false);
                      setRepeatNewPasswordError(false);
                    }}
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>
              <div className="card border border-base-200 rounded-lg shadow-sm">
                <div className="card-title px-4 py-2 bg-base-200 border-b border-base-300 rounded-t-lg">
                  <span className="text-lg font-semibold">
                    Cambiar nombre de usuario
                  </span>
                </div>
                <div className="card-body p-4 grid gap-4">
                  <div className="grid gap-2">
                    <TextBoxWithTextOnTop
                      text="Usuario"
                      type="text"
                      placeholder="Usuario..."
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUserError(false);
                      }}
                    />
                    {userError && (
                      <span className="text-red-500 ml-2 font-bold">
                        {userErrorMessage}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-accent mr-auto w-full"
                    onClick={() => changeUsername()}
                  >
                    Cambiar nombre de usuario
                  </button>
                </div>
              </div>
            </div>
            {user && user.role !== 1 && (
              <div className="card border border-base-200 rounded-lg shadow-sm">
                <div className="card-title px-4 py-2 bg-base-200 border-b border-base-300 rounded-t-lg">
                  <span className="text-lg font-semibold">Mis pedidos</span>
                </div>
                <div className="card-body p-4">
                  <table className="w-full text-center">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={order._id}
                          className="border-b border-base-300 hover:bg-base-200 cursor-pointer"
                          onClick={() => openModal(order)}
                        >
                          <td className="px-4 py-2">
                            <div className="font-medium">{index + 1}</div>
                          </td>
                          <td className="px-4 py-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {order.totalPrice.toFixed(2)}€
                          </td>
                          <td className="px-4 py-2">
                            <div
                              className={`${
                                (order.status == "Sin confirmar" &&
                                  "bg-orange-400") ||
                                (order.status == "Cancelado" && "bg-red-400") ||
                                (order.status == "Enviado" && "bg-green-400") ||
                                (order.status == "Confirmado" &&
                                  "bg-blue-400") ||
                                (order.status == "Recibido" && "bg-gray-400")
                              } rounded px-2 py-1 text-xs sm:text-sm font-normal`}
                            >
                              {order.status}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              {currentOrder && (
                <div>
                  <h3 className="font-bold text-lg flex flex-col">
                    <span>Pedido {currentOrder._id}</span>
                    <span className="text-sm">
                      Usuario: {currentOrder.user.username}
                    </span>
                  </h3>
                  <div className="m-2">
                    <form method="dialog">
                      <div className="flex flex-row">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg mb-2">
                            {currentOrder.itemsQuantity} Productos
                          </span>
                          <span className="mb-4 font-semibold">
                            Total: {currentOrder.totalPrice.toFixed(2)}€
                          </span>
                          <div className="grid grid-cols-2 gap-4">
                            {currentOrder.items.map((item, index) => (
                              <div key={index} className="flex flex-col">
                                {item !== null && (
                                  <>
                                    <img
                                      src={item.image}
                                      className="w-16 h-16 rounded-lg mb-2"
                                      alt={item.productName}
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-semibold">
                                        {item.productName}
                                      </span>
                                      <span>{item.type}</span>
                                      <span>Cantidad: {item.quantity}</span>
                                      <span className="font-semibold">
                                        {(item.price * item.quantity).toFixed(
                                          2
                                        )}
                                        €
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="divider" />
                          <div className="flex flex-col m-2">
                            <span className="font-bold">
                              Dirección de Envío:
                            </span>
                            <span>
                              <span className="font-semibold">Nombre: </span>
                              {currentOrder.shippingDetails.name}
                            </span>
                            <span>
                              <span className="font-semibold">Apellidos: </span>
                              {currentOrder.shippingDetails.surname}
                            </span>
                            <span>
                              <span className="font-semibold">
                                Dirección 1:{" "}
                              </span>
                              {currentOrder.shippingDetails.address1}
                            </span>
                            <span>
                              {currentOrder.shippingDetails.address2 && (
                                <>
                                  <span className="font-semibold">
                                    Dirección 2:{" "}
                                  </span>
                                  {currentOrder.shippingDetails.address2}
                                </>
                              )}
                            </span>
                            <span>
                              <span className="font-semibold">País: </span>
                              {currentOrder.shippingDetails.country}
                            </span>
                            <span>
                              <span className="font-semibold">Localidad: </span>
                              {currentOrder.shippingDetails.locality}
                            </span>
                            <span>
                              <span className="font-semibold">Provincia: </span>
                              {currentOrder.shippingDetails.province}
                            </span>
                            <span>
                              <span className="font-semibold">
                                Código postal:{" "}
                              </span>
                              {currentOrder.shippingDetails.postalCode}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center pl-14">
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(currentOrder._id, "Recibido")
                            }
                          >
                            Pedido redibido
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(currentOrder._id, "Cancelado")
                            }
                          >
                            Cancelar pedido
                          </button>

                          <button className="btn btn-accent">Cerrar</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
