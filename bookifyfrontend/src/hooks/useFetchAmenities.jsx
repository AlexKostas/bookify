import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetchAmenities = () => {
    const [availableAmenities, setAvailableAmenities] = useState([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            const endpointURL = '/amenities/getAllAmenities';

            try{
                const response = await axios.get(endpointURL);

                setAvailableAmenities(response.data);
            }
            catch(error){
                console.log(error);
            }
        }

        fetchAmenities();
    }, []);

    return {availableAmenities};
}

export default useFetchAmenities;