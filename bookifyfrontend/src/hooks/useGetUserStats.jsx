import useAxiosPrivate from "./useAxiosPrivate";
import { useEffect, useState } from "react";

const useGetUserStats = (username) => {
    const axiosPrivate = useAxiosPrivate();

    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (username === '') {
                setUserStats(null);
                return;
            }

            try {
                const response = await axiosPrivate.get(`/user/getUserStats/${username}`);

                setUserStats(response?.data ?? null);

            } catch (error) {
                //TODO: maybe we need a better error handling strategy here
                // Perhaps pass a callback function for error handling
                console.log(error);
                setUserStats(null);
            }
        };

        fetchUserStats();
    }, []);

    return userStats;
};

export default useGetUserStats;