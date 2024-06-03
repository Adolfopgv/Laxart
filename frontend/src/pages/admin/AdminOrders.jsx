import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [orderUsers, setOrderUsers] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/get-orders");
        console.log("Orders fetched:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };
    if (orders.length === 0) {
      fetchOrders();
    }
  }, []);

  return <div>hola</div>;
}
