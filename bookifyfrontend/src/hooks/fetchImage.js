import axios from "../api/axios";


const fetchImage = async ({url}) => {
            axios.get(url, { responseType: 'blob' })
                .then(response => {
                    const url = URL.createObjectURL(response.data);
                    return url
                }
               
            )
            .catch(error => {
                console.error('Failed to fetch image:', error);
                return null;
            });
        }

export default fetchImage;