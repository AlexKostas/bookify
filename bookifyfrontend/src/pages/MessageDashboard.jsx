import {useEffect, useState} from "react";
import Navbar from "../components/Navbar/Navbar";
import OldComposeMessage from "../components/ComposeMessage/OldComposeMessage";
import MessageGrid from "../components/MessagesGrid/MessageGrid";
import {useSearchContext} from "../context/SearchContext";
import {useParams} from "react-router-dom";
import ComposeMessage from "../components/ComposeMessage/ComposeMessage";

const MessageDashboard = () => {
    const [composePanelActive, setComposePanelActive] = useState(false);
    const { resetSearch } = useSearchContext();
    const { username: recipient } = useParams();

    useEffect(() => {
        resetSearch();
    }, []);

    useEffect(() => {
        if(recipient) setComposePanelActive(true);
    }, [recipient])

    return (
        <div>
            <Navbar />
            <h1>Inbox</h1>
            <button onClick={() => setComposePanelActive(true)}>Compose</button>

            {
                composePanelActive ?
                    (<ComposeMessage
                        open = {composePanelActive}
                        onClose={() => setComposePanelActive(false)}
                        preloadedRecipient={recipient}
                    />)
                    : <MessageGrid />
            }
        </div>
    );
}

export default MessageDashboard;