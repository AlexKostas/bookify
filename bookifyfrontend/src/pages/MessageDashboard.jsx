import {useEffect, useState} from "react";
import Navbar from "../components/Navbar/Navbar";
import ComposeMessage from "../components/ComposeMessage/ComposeMessage";
import MessageGrid from "../components/MessagesGrid/MessageGrid";
import {useSearchContext} from "../context/SearchContext";

const MessageDashboard = () => {
    const [composePanelActive, setComposePanelActive] = useState(false);
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Inbox</h1>
            <button onClick={() => setComposePanelActive(true)}>Compose</button>

            {
                composePanelActive ?
                    (<ComposeMessage
                        open = {composePanelActive}
                        onClose={() => setComposePanelActive(false)} />)
                    : <MessageGrid />
            }
        </div>
    );
}

export default MessageDashboard;