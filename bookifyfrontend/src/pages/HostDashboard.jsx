import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar/Navbar";
import RoomDashboard from "../components/RoomDashboard/RoomDashboard";
import {useSearchContext} from "../context/SearchContext";
import {useEffect} from "react";

const HostDashboard = () => {
    const { auth } = useAuth();
    const isInactiveHost = auth.roles.includes('inactive-host');
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

    return (
        <div>
            <Navbar />
            {
                isInactiveHost ? 
                    <h3>You have not currently been given host permissions. Please contact an admin for help</h3>
                    :(
                        <>
                            <h1>Host Dashboard</h1>
                            <RoomDashboard />
                        </>             
                        )
            }
        </div>
    );
}

export default HostDashboard;