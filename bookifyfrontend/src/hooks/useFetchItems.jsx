import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetchItems = (endpointURL) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        setLoading(true);

        try{
            const response = await axios.get(endpointURL);

            setItems(response.data);
        }
        catch(error){
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    const refetch = () => fetchItems();

    useEffect(() => {
        fetchItems();
    }, []);

    return {availableItems: items, loading, refetch};
}

export default useFetchItems;