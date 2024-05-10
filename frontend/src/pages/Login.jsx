import { useState } from "react"
import axios from 'axios'

export default function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const loginUser = () => {
    e.preventDefault()
    axios.get('/')
  }

  return (
    <>
      <div>
        <form onSubmit={loginUser}>
          <label>Correo</label>
          <input type="email" placeholder='Ingresar correo...' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
          <label>Contraseña</label>
          <input type="password" placeholder='Ingresar contraseña...' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
          <button type='submit'>Iniciar sesión</button>
        </form>
      </div>
    </>
  )
}
