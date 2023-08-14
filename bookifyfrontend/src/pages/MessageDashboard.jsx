import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ComposeMessage from "../components/ComposeMessage/ComposeMessage";
import MessageGrid from "../components/MessagesGrid/MessageGrid";

const MessageDashboard = () => {
    const navigate = useNavigate();
    const [composePanelActive, setComposePanelActive] = useState(false);

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