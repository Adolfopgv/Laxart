import { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function EmailVerification() {
    const [validUrl, setValidUrl] = useState(false)
    const param = useParams();

    useEffect(() => {
      const verifyEmailUrl = async () => {
        try {
            const {data} = await axios.get(`/users/${param.id}/verify/${param.token}`);
            console.log(data)
            setValidUrl(true)
        } catch (error) {
            console.log(error)
            setValidUrl(false)
        }
      };
      verifyEmailUrl()
    }, [param])

    return (
        <>
            {validUrl ? (
                <div>
                    <h1>Email verificado correctamente</h1>
                    <Link to="/login" className="btn-accent">
                        Iniciar sesión
                    </Link>
                </div>
            ) : (
                <div>
                    <h1>Error 404 URL no válida</h1>
                </div>
            )}
        </>
    )
}
