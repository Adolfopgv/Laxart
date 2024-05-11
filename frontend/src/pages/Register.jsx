import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

export default function Register() {
  const [passwordEye, setPasswordEye] = useState(false);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false);

  const handlePasswordShow = () => {
    setPasswordEye(!passwordEye);
  };

  const handleConfirmPasswordShow = () => {
    setConfirmPasswordEye(!confirmPasswordEye);
  };

  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password, repeatPassword } = data;
    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
        repeatPassword,
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({});
        toast.success("¡Usuario registrado satisfactoriamente!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Nombre de usuario</label>
        <input
          type="text"
          placeholder="Ingresar usuario..."
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label>Correo</label>
        <input
          type="email"
          placeholder="Ingresar correo..."
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Contraseña</label>
        <input
          type={passwordEye === false ? "password" : "text"}
          placeholder="Ingresar contraseña..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <div>
          {passwordEye === false ? (
            <AiFillEyeInvisible onClick={handlePasswordShow} />
          ) : (
            <AiFillEye onClick={handlePasswordShow} />
          )}
        </div>
        <label>Repite contraseña</label>
        <input
          type={confirmPasswordEye === false ? "password" : "text"}
          placeholder="Repetir contraseña..."
          value={data.repeatPassword}
          onChange={(e) => setData({ ...data, repeatPassword: e.target.value })}
        />
        <div>
          {confirmPasswordEye === false ? (
            <AiFillEyeInvisible onClick={handleConfirmPasswordShow} />
          ) : (
            <AiFillEye onClick={handleConfirmPasswordShow} />
          )}
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
