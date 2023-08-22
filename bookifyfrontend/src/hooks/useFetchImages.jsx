import axios from "../api/axios";
import {useState} from "react";

const useFetchImages = () => {
    const [loading, setLoading] = useState(false);

    const fetchImages = async (urls) => {
        setLoading(true);

        const promises = urls.map(url =>
            axios.get(url, { responseType: 'blob' })
                .then(response => URL.createObjectURL(response.data))
                .catch(error => {
                    console.error(`Failed to fetch image from ${url}:`, error);
                    return null;
                })
        );

        const imageUrls = await Promise.all(promises);
        setLoading(false);

        return imageUrls.filter(url => url !== null);
    }

    return {fetchImages, loading}
}

export default useFetchImages;