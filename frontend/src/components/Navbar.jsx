import { useContext } from "react";
import { UserContext } from "../context/userContext";
import NavBarLoggedIn from "./NavbarLoggedIn";
import NavBarLoggedOut from "./NavbarLoggedOut";

export default function Navbar() {
  const { user } = useContext(UserContext);

  return <>{user ? <NavBarLoggedIn /> : <NavBarLoggedOut />}</>;
}
