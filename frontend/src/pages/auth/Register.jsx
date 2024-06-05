import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { UserContext } from "../../context/userContext";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import laxart_logo from "../../assets/icons/laxart_logo.png";

export default function Register() {
  const [passwordEye, setPasswordEye] = useState(false);
  const [confirmPasswordEye, setConfirmPasswordEye] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [userError, setUserError] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] =
    useState("");

  const handlePasswordShow = () => {
    setPasswordEye(!passwordEye);
  };

  const handleConfirmPasswordShow = () => {
    setConfirmPasswordEye(!confirmPasswordEye);
  };

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setUserError(false);
    setRepeatPasswordError(false);
    const idToast = toast.loading("Registrando usuario...");

    const { username, email, password, repeatPassword } = data;
    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
        repeatPassword,
      });

      if (response.data.error) {
        toast.error(response.data.error, { id: idToast });
        switch (response.data.error) {
          case "No puedes dejar espacios en blanco":
            setEmailError(true);
            setEmailErrorMessage(response.data.error);
            setPasswordError(true);
            setPasswordErrorMessage(response.data.error);
            setUserError(true);
            setUserErrorMessage(response.data.error);
            setRepeatPasswordError(true);
            setRepeatPasswordErrorMessage(response.data.error);
            break;
          case "El correo es requerido" || "Este correo ya está en uso":
            setEmailError(true);
            setEmailErrorMessage(response.data.error);
            break;
          case "La contraseña es requerida y debe tener al menos 6 caracteres" ||
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número":
            setPasswordError(true);
            setPasswordErrorMessage(response.data.error);
            break;
          case "Las contraseñas no coinciden":
            setPasswordError(true);
            setPasswordErrorMessage(response.data.error);
            setRepeatPasswordError(true);
            setRepeatPasswordErrorMessage(response.data.error);
            break;
        }
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
            duration: 10000,
          }
        );
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al registrar usuario", { id: idToast });
    }
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen bg-primary flex items-center">
          <div className="card mx-auto w-full max-w-5xl  shadow-xl">
            <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
              <div className="py-24 px-10">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Registro
                </h2>
                <form onSubmit={registerUser}>
                  <div className="mb-4">
                    <TextBoxWithTextOnTop
                      text="Correo"
                      type="email"
                      placeholder="Correo..."
                      value={data.email}
                      onChange={(e) => {
                        setData({ ...data, email: e.target.value });
                        setEmailError(false);
                      }}
                    />
                    {emailError && (
                      <span className="text-error ml-2 font-bold">
                        {emailErrorMessage}
                      </span>
                    )}
                    <TextBoxWithTextOnTop
                      text="Usuario"
                      type="text"
                      placeholder="Usuario..."
                      value={data.username}
                      onChange={(e) => {
                        setData({ ...data, username: e.target.value });
                        setUserError(false);
                      }}
                    />
                    {userError && (
                      <span className="text-error ml-2 font-bold">
                        {userErrorMessage}
                      </span>
                    )}
                    <TextBoxWithTextOnTop
                      text="Contraseña"
                      type={passwordEye === false ? "password" : "text"}
                      placeholder="Contraseña..."
                      value={data.password}
                      onChange={(e) => {
                        setData({ ...data, password: e.target.value });
                        setPasswordError(false);
                      }}
                      eye={
                        <div>
                          {passwordEye === false ? (
                            <AiFillEyeInvisible onClick={handlePasswordShow} />
                          ) : (
                            <AiFillEye onClick={handlePasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {passwordError && (
                      <span className="text-error ml-2 font-bold">
                        {passwordErrorMessage}
                      </span>
                    )}
                    <TextBoxWithTextOnTop
                      text="Repetir contraseña"
                      type={confirmPasswordEye === false ? "password" : "text"}
                      placeholder="Repetir contraseña..."
                      value={data.repeatPassword}
                      onChange={(e) => {
                        setData({ ...data, repeatPassword: e.target.value });
                        setRepeatPasswordError(false);
                      }}
                      eye={
                        <div>
                          {confirmPasswordEye === false ? (
                            <AiFillEyeInvisible
                              onClick={handleConfirmPasswordShow}
                            />
                          ) : (
                            <AiFillEye onClick={handleConfirmPasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {repeatPasswordError && (
                      <span className="text-error ml-2 font-bold">
                        {repeatPasswordErrorMessage}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={"btn mt-2 w-full btn-accent"}
                  >
                    Registrar
                  </button>
                </form>
              </div>
              <div className="flex items-center">
                <img src={laxart_logo} alt="logo clara" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate("/error")
      )}
    </>
  );
}
