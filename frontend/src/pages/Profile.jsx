import { useContext } from "react"
import { UserContext } from "../context/userContext"

export default function Profile() {
  const {user} = useContext(UserContext)
  return (
    <div>
      <h1>PROFILE</h1>
      {!!user && (<h2>Hola {user.username}!</h2>)}
    </div>
  )
}
