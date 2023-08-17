import { useEffect, useState } from 'react';
import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";

function useAutoFetchMessages() {
    const [messages, setMessages] = useState([]);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const fetchInterval = 6000;

    useEffect(() => {
        if(!auth) return;

        let isMounted = true;

        const fetchMessages = async () => {
            while (isMounted) {
                try {
                    const endpointURL = 'messages/getUnreadMessagesCount';

                    const response = await axiosPrivate.get(endpointURL);
                    const unreadMessageCount = response.data;
                    setMessages(unreadMessageCount);
                }
                catch (error) {
                    console.log(error);
                }

                await new Promise(resolve => setTimeout(resolve, fetchInterval)); // Wait for next fetch
            }
        };

        fetchMessages();

        return () => {
            isMounted = false;
        };
    }, [auth]);

    return messages;
}

export default useAutoFetchMessages;