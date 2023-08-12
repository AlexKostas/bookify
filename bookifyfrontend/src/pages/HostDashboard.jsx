import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import RoomDashboard from "../components/RoomDashboard/RoomDashboard";

const HostDashboard = () => {
    const { auth } = useAuth();
    const isInactiveHost = auth.roles.includes('inactive-host');
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            {
                isInactiveHost ? 
                    <h3>You have not currently been given host permissions. Please contant an admin for help</h3>
                    :(
                        <>
                            <h1>Host Dashboard</h1>
                            <button onClick={() => navigate('/create')}>Create new room</button>
                            <RoomDashboard />
                        </>             
                        )
            }
        </div>
    );
}

export default HostDashboard;