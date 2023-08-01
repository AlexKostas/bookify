import axios from "../api/axios";
import useAuth from "./useAuth";
import { useLocalStorage } from "./useLocalStorage";

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { getItem } = useLocalStorage();

    const refresh = async () => {
        const refreshToken = getItem('refreshToken');

        const response = await axios.post('/registration/refresh', JSON.stringify(
            {
                refreshToken
            }
        ));

        setAuth(prev => {
            console.log(prev.accessToken);
            console.log(response.data.accessToken);
            return { ...prev, 
                user: response.data.username,
                refreshToken: refreshToken,
                roles: response.data.roles,
                accessToken: response.data.accessToken }
        });

        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;