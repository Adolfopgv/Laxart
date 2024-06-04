import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import Error from "../error/Error";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderState, setOrderState] = useState(false);
  const { user } = useContext(UserContext);

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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const details = await Promise.all(
          orders.map(async (order) => {
            const orderUser = await axios.get(`/users/${order.userId}`);

            if (orderUser.data.error) {
              console.error(
                "Error al obtener detalles del usuario:",
                orderUser.data.error
              );
              return null;
            }

            const productDetails = await Promise.all(
              order.items.map(async (item) => {
                const orderProduct = await axios.get(
                  `/get-product/${item.product}`
                );
                if (orderProduct.data.error) {
                  console.error(
                    "Error al obtener detalles del producto:",
                    orderProduct.data.error
                  );
                  return null;
                }
                return {
                  ...orderProduct.data,
                  quantity: item.quantity,
                  type: item.type,
                };
              })
            );
            return {
              user: orderUser.data,
              products: productDetails,
              orderId: order._id,
              date: order.createdAt,
              itemsQuantity: order.itemsQuantity,
              status: order.status,
              totalPrice: order.totalPrice,
            };
          })
        );
        setOrderDetails(details);

        console.log("details: ", details);
      } catch (error) {
        console.error("Error al obtener detalles de la orden: ", error);
      }
    };

    if (orders.length > 0) {
      fetchOrderDetails();
    }
  }, [orders, orderState]);

  const openModal = (orderDetail) => {
    setCurrentOrder(orderDetail);
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

  return (
    <>
      {user && user.role === 1 ? (
        <div className="flex justify-center m-10 overflow-y-auto overflow-x-auto overflow-hidden max-h-[650px] w-[100%]">
          <table className="text-center font-light text-surface max-w-[100%] min-w-[75%]">
            <caption className="caption-top mb-2">
              <span className="card-title">Pedidos {orderDetails.length}</span>
            </caption>
            <thead className="border-b border-accent font-medium">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-4">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-4">
                  Email
                </th>
                <th scope="col" className="px-6 py-4">
                  Fecha de pedido
                </th>
                <th scope="col" className="px-6 py-4">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4">
                  Total
                </th>
                <th scope="col" className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.map((orderDetail, index) => (
                <tr key={index} className="border-b border-base-300">
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12">
                      <img
                        src={orderDetail.user.avatar}
                        alt="Avatar"
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {orderDetail.user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(orderDetail.date).toLocaleDateString("es-ES")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div
                      className={`${
                        (orderDetail.status == "Sin confirmar" &&
                          "bg-orange-400") ||
                        (orderDetail.status == "Cancelado" && "bg-red-400") ||
                        (orderDetail.status == "Enviado" && "bg-green-400") ||
                        (orderDetail.status == "Confirmado" && "bg-blue-400")
                      } rounded font-normal`}
                    >
                      {orderDetail.status}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-semibold">
                    {orderDetail.totalPrice.toFixed(2)}€
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      className="btn"
                      onClick={() => openModal(orderDetail)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              {currentOrder && (
                <div>
                  <h3 className="font-bold text-lg flex flex-col">
                    <span>Pedido {currentOrder.orderId}</span>
                    <span className="text-sm">
                      Usuario: {currentOrder.user.username}
                    </span>
                  </h3>
                  <div className="modal-action">
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
                            {currentOrder.products.map((product, index) => (
                              <div key={index} className="flex flex-col">
                                <img
                                  src={product.image}
                                  className="w-16 h-16 rounded-lg mb-2"
                                  alt={product.productName}
                                />
                                <div className="flex flex-col">
                                  <span className="font-semibold">
                                    {product.productName}
                                  </span>
                                  <span>{product.type}</span>
                                  <span>Cantidad: {product.quantity}</span>
                                  <span className="font-semibold">
                                    {(product.price * product.quantity).toFixed(
                                      2
                                    )}
                                    €
                                  </span>
                                </div>
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
                              {currentOrder.user.shippingAddress.name}
                            </span>
                            <span>
                              <span className="font-semibold">Apellidos: </span>
                              {currentOrder.user.shippingAddress.surname}
                            </span>
                            <span>
                              <span className="font-semibold">
                                Dirección 1:{" "}
                              </span>
                              {currentOrder.user.shippingAddress.address1}
                            </span>
                            <span>
                              {currentOrder.user.shippingAddress.address2 && (
                                <>
                                  <span className="font-semibold">
                                    Dirección 2:{" "}
                                  </span>
                                  {currentOrder.user.shippingAddress.address2}
                                </>
                              )}
                            </span>
                            <span>
                              <span className="font-semibold">País: </span>
                              {currentOrder.user.shippingAddress.country}
                            </span>
                            <span>
                              <span className="font-semibold">Localidad: </span>
                              {currentOrder.user.shippingAddress.locality}
                            </span>
                            <span>
                              <span className="font-semibold">Provincia: </span>
                              {currentOrder.user.shippingAddress.province}
                            </span>
                            <span>
                              <span className="font-semibold">
                                Código postal:{" "}
                              </span>
                              {currentOrder.user.shippingAddress.postalCode}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center ml-4">
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(
                                currentOrder.orderId,
                                "Confirmado"
                              )
                            }
                          >
                            Confirmar pedido
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(
                                currentOrder.orderId,
                                "Cancelado"
                              )
                            }
                          >
                            Cancelar pedido
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              changeOrderState(currentOrder.orderId, "Enviado")
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
