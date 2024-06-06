import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import laxart_logo from "../../assets/icons/laxart_logo.png";

export default function EmailVerification() {
  const { user } = useContext(UserContext);
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const { data } = await axios.get(
          `/users/${param.id}/verify/${param.token}`
        );
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <>
      {!user && validUrl ? (
        <div className="min-h-screen bg-primary flex items-center">
          <div className="card mx-auto w-full max-w-5xl  shadow-xl">
            <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
              <div className="py-24 px-10 flex flex-col items-center gap-24">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  Email verificado correctamente
                </h2>
                <Link to="/login" className="btn btn-accent w-60">
                  Iniciar sesión
                </Link>
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
