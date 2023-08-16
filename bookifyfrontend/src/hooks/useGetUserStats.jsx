import useAxiosPrivate from "./useAxiosPrivate";
import { useEffect, useState } from "react";

const useGetUserStats = (usrname) => {
    const axiosPrivate = useAxiosPrivate();

    const [userStats, setUserStats] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (usrname === '') {
                setUserStats(null);
                return;
            }

            try {
                const response = await axiosPrivate.get(`/user/getUserStats/${usrname}`);

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