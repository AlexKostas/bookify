import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HostDashboard = () => {
    const { auth } = useAuth();
    const isInactiveHost = auth.roles.includes('inactive-host');
    const navigate = useNavigate();

    return (
        <div>
            {
                isInactiveHost ? 
                    <h3>You have not currently been given host permissions. Please contant an admin for help</h3>
                    :(
                        <>
                            <h1>Host Dashboard</h1>
                            <button onClick={() => navigate('/create')}>Create new room</button>
                        </>             
                        )
            }
        </div>
    );
}

export default HostDashboard;