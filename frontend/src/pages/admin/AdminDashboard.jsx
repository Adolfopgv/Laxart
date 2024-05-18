import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

export default function AdminDashboard() {
    const { user } = useContext(UserContext);

    return (
        <>
            {user && user.role === 1 && <div>AdminDashboard</div>}
        </>

    )
}
