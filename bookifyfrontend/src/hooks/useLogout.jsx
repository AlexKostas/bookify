import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const { setAuth } = useAuth();
    const { removeItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const logout = async (redirectToLogin) => {
        setAuth(null);

        try{
            const response = await axiosPrivate.post("registration/logout");
        }
        catch(error){
            console.error(error);
        }

        if(redirectToLogin)
            navigate('/login');
        else{
            removeItem('refreshToken');
            navigate('/');
        }

        window.location.reload();
    }

    return logout;
}

export default useLogout;