import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Typography from "@mui/material/Typography";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import laxart_logo from "../../assets/icons/laxart_logo.png";
import Error from "../error/Error";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Laxart
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser, setLogged } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "",
    verified: "",
  });
  const [passwordEye, setPasswordEye] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handlePasswordShow = () => {
    setPasswordEye(!passwordEye);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Iniciando sesión...");

    const { email, password, role, verified } = data;
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
        role,
        verified,
      });

      if (data.error) {
        toast.error(data.error, { id: idToast });
        switch (data.error) {
          case "No puedes dejar espacios en blanco":
            setEmailError(true);
            setEmailErrorMessage(data.error);
            setPasswordError(true);
            setPasswordErrorMessage(data.error);
            break;
          case "El correo es requerido":
            setEmailError(true);
            setEmailErrorMessage(data.error);
            break;
          case "La contraseña es requerida":
            setPasswordError(true);
            setPasswordErrorMessage(data.error);
            break;
        }
      } else if (data.role !== 1 && data.verified) {
        toast.success(`Bienvenido ${data.username}!`, { id: idToast });
        setUser(data.user);
        setData({});
        setLogged(true);
        navigate("/");
      } else if (data.role === 1) {
        toast.success(`Bienvenido admin ${email}`, { id: idToast });
        setUser(data.user);
        setData({});
        setLogged(true);
        navigate("/admin-dashboard/products");
      } else {
        toast.error(data.message, { id: idToast });
      }
    } catch (error) {
      toast.error("Error al iniciar sesión", { id: idToast });
    }
  };

  const createOrGetGoogleUser = async (response) => {
    const decoded = jwtDecode(response.credential); // Error
    console.log(decoded);
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen bg-primary flex items-center">
          <div className="card mx-auto w-full max-w-5xl  shadow-xl">
            <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
              <div className="py-24 px-10">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Iniciar Sesión
                </h2>
                <form onSubmit={loginUser}>
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
                      text="Contraseña"
                      type={passwordEye ? "text" : "password"}
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
                  </div>
                  <div className="text-right link-info">
                    <Link to="/forgot-password">
                      <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                        ¿Has olvidado tu contraseña?
                      </span>
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className={"btn mt-2 mb-4 w-full btn-accent"}
                  >
                    Iniciar sesión
                  </button>
                  {/* <GoogleLogin
                    shape="circle"
                    onSuccess={createOrGetGoogleUser}
                  /> */}

                  <div className="text-center mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register">
                      <span className="link-info inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                        ¡Registrate ahora!
                      </span>
                    </Link>
                    <div className="mt-2">
                      <Copyright />
                    </div>
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
