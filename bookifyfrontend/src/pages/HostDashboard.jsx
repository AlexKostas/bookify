import useAuth from "../hooks/useAuth";

const HostDashboard = () => {
    const { auth } = useAuth();
    const isInactiveHost = auth.roles.includes('inactive-host');

    return (
        <div>
            {
                isInactiveHost ? 
                    <h3>You have not currently been given host permissions. Please contant an admin for help</h3>
                    :<h1>Host Dashboard</h1>
            }
        </div>
    );
}

export default HostDashboard;