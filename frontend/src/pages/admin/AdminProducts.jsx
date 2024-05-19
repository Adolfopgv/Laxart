import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";

export default function AdminProducts() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user && user.role === 1 && (
        <>
          <h1>Añadir un nuevo producto</h1>
          <TextBoxWithTextOnTop
            type="text"
            text="Nombre del producto"
            placeholder="Nombre de producto..."
          />
        </>
      )}
    </>
  );
}
