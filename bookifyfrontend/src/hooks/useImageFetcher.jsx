import { useState, useEffect } from 'react';
import axios from '../api/axios';

const useImageFetcher = (url) => {
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            axios.get(url, { responseType: 'blob' })
                .then(response => {
                    const url = URL.createObjectURL(response.data);
                    setImageData(url);
                    setLoading(false);
                }
            )
            .catch(error => {
                console.error('Failed to fetch image:', error);
                setError(error);
                setLoading(false);
            });
        }

        fetchImage();
    }, [url]);

    return {imageData, loading, error, setImageData};
}

export default useImageFetcher;