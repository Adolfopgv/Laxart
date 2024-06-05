import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/profile");
        setUser(data);
      } catch (error) {
        console.error("Error recogiendo usuario: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [logged, change]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, setLogged, setChange }}
    >
      {children}
    </UserContext.Provider>
  );
}
