import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetchItems = (endpointURL) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try{
                const response = await axios.get(endpointURL);

                setItems(response.data);
            }
            catch(error){
                console.log(error);
            }
        }

        fetchItems();
    }, []);

    return {availableItems: items};
}

export default useFetchItems;