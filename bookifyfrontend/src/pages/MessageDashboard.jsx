import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ComposeMessage from "../components/ComposeMessage/ComposeMessage";

const MessageDashboard = () => {
    const navigate = useNavigate();
    const [composePanelActive, setComposePanelActive] = useState(false);

    return (
        <div>
            <Navbar />
            <h1>Message Dashboard</h1>
            <button onClick={() => setComposePanelActive(true)}>Compose</button>

            {
                composePanelActive && 
                    (<ComposeMessage onClose={() => setComposePanelActive(false)} />)
            }
        </div>
    );
}

export default MessageDashboard;