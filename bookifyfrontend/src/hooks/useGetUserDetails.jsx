import useAxiosPrivate from "./useAxiosPrivate";
import { useEffect, useState } from "react";

const useGetUserDetails = (usrname) => {
  const axiosPrivate = useAxiosPrivate();

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (usrname === '') {
        setUserDetails(null);
        return;
      }

      try {
        const response = await axiosPrivate.get(`/user/getUser/${usrname}`);
        const { username, firstName, lastName, email, phoneNumber } = response.data;

        setUserDetails({
          username,
          firstName,
          lastName,
          email,
          phoneNumber,
        });

      } catch (error) {
        //TODO: maybe we need a better error handling strategy here
        // Perhaps pass a callback function for error handling
        console.log(error);
        setUserDetails(null);
      }
    };

    fetchUserDetails();
  }, []);

  return userDetails;
};

export default useGetUserDetails;