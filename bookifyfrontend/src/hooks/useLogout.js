import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

const useLogout = () => {
    const { setAuth } = useAuth();
    const { removeItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();

    const logout = async () => {
        setAuth({});

        try{
            const response = await axiosPrivate.post("registration/logout");
            removeItem('refreshToken');
        }
        catch(error){
            console.error(error);
        }
    }

    return logout;
}

export default useLogout;