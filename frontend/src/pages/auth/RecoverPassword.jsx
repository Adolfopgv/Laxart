import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextBoxWithTextOnTop from "../../components/TextBoxWithTextOnTop";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import laxart_logo from "../../assets/icons/laxart_logo.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RecoverPassword() {
  const { user } = useContext(UserContext);
  const [validUrl, setValidUrl] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    repeatNewPassword: "",
  });
  const [newPasswordEye, setNewPasswordEye] = useState(false);
  const [repeatNewPasswordEye, setRepeatNewPasswordEye] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordErrorMsg, setNewPasswordErrorMsg] = useState("");
  const [repeatNewPasswordError, setRepeatNewPasswordError] = useState(false);
  const [repeatNewPasswordErrorMsg, setRepeatNewPasswordErrorMsg] =
    useState("");
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPasswordUrl = async () => {
      try {
        const response = await axios.get(
          `/users/recover-password/${param.id}/${param.token}`
        );
        if (!response.data.error) setValidUrl(true);
      } catch (error) {
        console.error("verify pass error", error);
        setValidUrl(false);
      }
    };
    verifyPasswordUrl();
  }, [param]);

  const recoverPassword = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Actualizando contraseña...");

    try {
      const response = await axios.post(`users/recover-password/${param.id}`, {
        newPassword: passwords.newPassword,
        repeatNewPassword: passwords.repeatNewPassword,
      });
      if (!response.data.error) {
        toast.success(response.data.message, { id: idToast });
        navigate("/login");
      } else {
        toast.error(response.data.error, { id: idToast });
        switch (response.data.error) {
          case "Debes ingresar una contraseña nueva":
            setNewPasswordError(true);
            setNewPasswordErrorMsg(response.data.error);
            break;
          case "Debes repetir la contraseña":
            setRepeatNewPasswordError(true);
            setRepeatNewPasswordErrorMsg(response.data.error);
            break;
          default:
            setNewPasswordError(true);
            setNewPasswordErrorMsg(response.data.error);
            setRepeatNewPasswordError(true);
            setRepeatNewPasswordErrorMsg(response.data.error);
            break;
        }
      }
    } catch (error) {}
  };

  const handleNewPasswordShow = () => {
    setNewPasswordEye(!newPasswordEye);
  };

  const handleRepeatNewPasswordShow = () => {
    setRepeatNewPasswordEye(!repeatNewPasswordEye);
  };

  return (
    <>
      {validUrl ? (
        <div className="min-h-screen bg-primary flex items-center">
          <div className="card mx-auto w-full max-w-5xl  shadow-xl">
            <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
              <div className="py-24 px-10">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Recupera tu contraseña
                </h2>
                <form onSubmit={recoverPassword}>
                  <div className="mb-4">
                    <TextBoxWithTextOnTop
                      text="Nueva contraseña"
                      type={newPasswordEye ? "text" : "password"}
                      placeholder="Nueva contraseña..."
                      value={passwords.newPassword}
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        });
                        setNewPasswordError(false);
                      }}
                      eye={
                        <div className="cursor-pointer">
                          {newPasswordEye === false ? (
                            <AiFillEyeInvisible
                              onClick={handleNewPasswordShow}
                            />
                          ) : (
                            <AiFillEye onClick={handleNewPasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {newPasswordError && (
                      <span className="text-red-500 ml-2 font-bold">
                        {newPasswordErrorMsg}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <TextBoxWithTextOnTop
                      text="Repetir nueva contraseña"
                      type={repeatNewPasswordEye ? "text" : "password"}
                      placeholder="Repetir nueva contraseña..."
                      value={passwords.repeatNewPassword}
                      onChange={(e) => {
                        setPasswords({
                          ...passwords,
                          repeatNewPassword: e.target.value,
                        });
                        setRepeatNewPasswordError(false);
                      }}
                      eye={
                        <div className="cursor-pointer">
                          {repeatNewPasswordEye === false ? (
                            <AiFillEyeInvisible
                              onClick={handleRepeatNewPasswordShow}
                            />
                          ) : (
                            <AiFillEye onClick={handleRepeatNewPasswordShow} />
                          )}
                        </div>
                      }
                    />
                    {repeatNewPasswordError && (
                      <span className="text-red-500 ml-2 font-bold">
                        {repeatNewPasswordErrorMsg}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={"btn mt-2 mb-4 w-full btn-accent"}
                  >
                    Cambiar contraseña
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
        <div>
          <h1>Error 404 URL no válida</h1>
        </div>
      )}
    </>
  );
}
