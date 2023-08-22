import axios from "../api/axios";
import {useState} from "react";


const useFetchImage = async (url) => {
    const [loading, setLoading] = useState(false);

    const fetchImage = async () => {
        setLoading(true);

        axios.get(url, { responseType: 'blob' })
            .then(response => {
                    const url = URL.createObjectURL(response.data);
                    setLoading(false);
                    return url;
                }
            )
            .catch(error => {
                console.error('Failed to fetch image:', error);
                setLoading(false);
                return null;
            });
    }

    return {fetchImage, loading};
}

export default useFetchImage;