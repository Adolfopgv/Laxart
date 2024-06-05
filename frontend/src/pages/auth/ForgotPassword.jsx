import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import { Link } from "react-router-dom";
import axios from "axios";
import laxart_logo from "../../assets/icons/laxart_logo.png";
import Error from "../error/Error";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const navigate = useNavigate();

  const sendRecoverEmail = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Enviando email...");
    try {
      if (email) {
        const response = await axios.get(`/users/${email}/recover-password`);
        if (!response.data.error) {
          setEmail("");
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
        } else {
          toast.error(response.data.error, { id: idToast });
          setEmailError(true);
          setEmailErrorMsg(response.data.error);
        }
      } else {
        toast.error("Debes escribir un email para recuperar la contraseña", {
          id: idToast,
        });
        setEmailError(true);
        setEmailErrorMsg(
          "Debes escribir un email para recuperar la contraseña"
        );
      }
    } catch (error) {
      toast.error("Error del servidor", { id: idToast });
      console.error(error);
    }
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen bg-primary flex items-center">
          <div className="card mx-auto w-full max-w-5xl  shadow-xl">
            <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
              <div className="py-24 px-10">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Recupera tu contraseña
                </h2>
                <form onSubmit={sendRecoverEmail}>
                  <div className="mb-4">
                    <TextBoxWithTextOnTop
                      text="Escriba el correo de tu cuenta"
                      type="email"
                      placeholder="Correo..."
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                      }}
                    />
                    {emailError && (
                      <span className="text-error ml-2 font-bold">
                        {emailErrorMsg}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={"btn mt-2 mb-4 w-full btn-accent"}
                  >
                    Enviar email de recuperación
                  </button>
                  <div className="text-center mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register">
                      <span className="link-info inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                        ¡Registrate ahora!
                      </span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="flex items-center">
                <img src={laxart_logo} alt="logo clara" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
}
