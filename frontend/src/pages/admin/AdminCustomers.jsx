import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
      const getUsers = async () => {
        const response = await axios.get("/users");

        if (!response.data.error) {
          setUsers(response.data);
        }
      };

      getUsers();
    } catch (error) {
      console.error("Error useEffect all users: ", error);
    }
  }, []);

  return (
    <ul className="m-10 overflow-x-auto overflow-y-auto overflow-hidden">
      <span className="mb-2 text-lg card-title">Usuarios</span>
      {users.map((user) => (
        <>
          {user.role !== 1 && (
            <li
              key={user._id}
              className="flex justify-between gap-x-6 py-5 border-b border-base-300 w-full"
            >
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full"
                  src={user.avatar}
                  alt=""
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.username}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            </li>
          )}
        </>
      ))}
    </ul>
  );
}
