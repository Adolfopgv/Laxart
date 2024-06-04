import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Error from "../error/Error";

export default function AdminDashboard() {
  const { user } = useContext(UserContext);

  return <>{user && user.role === 1 ? <div>AdminDashboard</div> : <Error />}</>;
}
