import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const { setAuth } = useAuth();
    const { removeItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const logout = async () => {
        setAuth(null);

        try{
            const response = await axiosPrivate.post("registration/logout");
        }
        catch(error){
            console.error(error);
        }

        removeItem('refreshToken');
        navigate('/');
    }

    return logout;
}

export default useLogout;