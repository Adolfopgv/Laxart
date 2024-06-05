import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import Error from "../error/Error";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderState, setOrderState] = useState(false);
  const { user } = useContext(UserContext);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/get-orders");
        console.log("Orders fetched:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error al recoger productos: ", error);
      }
    };
    fetchOrders();
  }, [orderState]);

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

  const totalOrdersPrice = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  return (
    <>
      {user && user.role === 1 ? (
        <div className="flex justify-center m-10 overflow-y-auto overflow-x-auto overflow-hidden">
          <div className="m-4 sm:m-10 overflow-x-auto w-full">
            <div className="min-w-full overflow-x-auto w-full">
              <table className="text-center font-light text-surface w-full mb-4">
                <caption className="caption-top mb-2 text-lg">
                  <span className="card-title">Pedidos {orders.length}</span>
                </caption>
                <thead className="bg-secondary border-b border-accent font-medium text-base sm:text-lg">
                  <tr>
                    <th scope="col" className="px-2 py-2 sm:px-6">
                      #
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-6">
                      Email
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-6">
                      Fecha de pedido
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-6">
                      Estado
                    </th>
                    <th scope="col" className="px-2 py-2 sm:px-6">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm sm:text-base">
                  {orders?.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-base-300 hover:bg-base-200 cursor-pointer"
                      onClick={() => openModal(order)}
                    >
                      <td className="px-2 py-2 sm:px-6 font-medium">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-6">
                        {order.user.email}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-6">
                        {new Date(order.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-6">
                        <div
                          className={`${
                            (order.status == "Sin confirmar" &&
                              "bg-orange-400") ||
                            (order.status == "Cancelado" && "bg-red-400") ||
                            (order.status == "Enviado" && "bg-green-400") ||
                            (order.status == "Confirmado" && "bg-blue-400") ||
                            (order.status == "Recibido" && "bg-gray-400")
                          } rounded px-2 py-1 text-xs sm:text-sm font-normal`}
                        >
                          {order.status}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-6 font-semibold">
                        {order.totalPrice.toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <span className="text-xl font-medium">
              Ganancias totales: {totalOrdersPrice.toFixed(2)}€
            </span>
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
                              changeOrderState(currentOrder._id, "Confirmado")
                            }
                          >
                            Confirmar pedido
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(currentOrder._id, "Cancelado")
                            }
                          >
                            Cancelar pedido
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(currentOrder._id, "Enviado")
                            }
                          >
                            Pedido enviado
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
      ) : (
        <Error />
      )}
    </>
  );
}
