import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password, repeatPassword } = data;
    try {
      const response = await axios.post('/register', {
        username,
        email,
        password,
        repeatPassword
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({});
        toast.success('¡Usuario registrado satisfactoriamente!');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar usuario');
    }
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Nombre de usuario</label>
        <input type="text" placeholder='Ingresar usuario...' value={data.username} onChange={(e) => setData({...data, username: e.target.value})}/>
        <label>Correo</label>
        <input type="email" placeholder='Ingresar correo...' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
        <label>Contraseña</label>
        <input type="password" placeholder='Ingresar contraseña...' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
        <label>Repite contraseña</label>
        <input type="password" placeholder='Repetir contraseña...' value={data.repeatPassword} onChange={(e) => setData({...data, repeatPassword: e.target.value})}/>
        <button type='submit'>Registrarse</button>
      </form>
    </div>
  );
}
