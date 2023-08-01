import axios from "../api/axios";
import useAuth from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { getItem } = useLocalStorage();

    const refresh = async () => {
        const refreshToken = getItem('refreshToken');

        try {
            const response = await axios.post('/registration/refresh', JSON.stringify(
            {
                refreshToken
            }
            ));

            setAuth(prev => {
                return { ...prev, 
                    user: response.data.username,
                    refreshToken: refreshToken,
                    roles: response.data.roles,
                    accessToken: response.data.accessToken }
            });

            return response.data.accessToken;
        }
        catch(error){
            console.log(error);
            setAuth(null);
            return null;
        }
        
    }

    return refresh;
}

export default useRefreshToken;