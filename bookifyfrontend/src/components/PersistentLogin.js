import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";

const PersistentLogin = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const verifyRefreshToken = async () => {
            try {
                await refresh();
                console.log(auth);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setLoading(false);

    }, [])

    return (
        <>
            {loading ? <p>Loading...</p> : <Outlet />}
        </>
    );
}

export default PersistentLogin;