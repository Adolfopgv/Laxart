import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { UserContext } from "../context/userContext";

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
  const { user } = useContext(UserContext);
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
    <>
      {!user ? (
        <div className="min-h-screen bg-base-300 flex items-center">
          <div className="card mx-auto w-full max-w-5xl  shadow-xl">
            <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
              <div className="py-24 px-10">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Registro
                </h2>
                <form onSubmit={registerUser}>
                  <div className="mb-4">
                    <div className="form-control w-full mt-4">
                      <label className="label">
                        <span className="label-text text-base-content">
                          Correo
                        </span>
                      </label>
                      <input
                        className="input input-bordered w-full "
                        type="email"
                        placeholder="Correo..."
                        value={data.email}
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-control w-full mt-4">
                      <label className="label">
                        <span className="label-text text-base-content">
                          Contraseña
                        </span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type={passwordEye === false ? "password" : "text"}
                        placeholder="Contraseña..."
                        value={data.password}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="">
                      {passwordEye === false ? (
                        <AiFillEyeInvisible onClick={handlePasswordShow} />
                      ) : (
                        <AiFillEye onClick={handlePasswordShow} />
                      )}
                    </div>
                    <div className="form-control w-full mt-4">
                      <label className="label">
                        <span className="label-text text-base-content">
                          Repetir contraseña
                        </span>
                      </label>
                      <input
                        className="input input-bordered w-full"
                        type={confirmPasswordEye === false ? "password" : "text"}
                        placeholder="Repetir contraseña..."
                        value={data.repeatPassword}
                        onChange={(e) =>
                          setData({ ...data, repeatPassword: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      {confirmPasswordEye === false ? (
                        <AiFillEyeInvisible
                          onClick={handleConfirmPasswordShow}
                        />
                      ) : (
                        <AiFillEye onClick={handleConfirmPasswordShow} />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={"btn mt-2 w-full btn-primary"}
                  >
                    Registrar
                  </button>
                </form>
              </div>
              <div>
                <img src="" alt="logo clara" />
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
