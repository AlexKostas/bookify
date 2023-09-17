import { useParams } from "react-router-dom"
import RoomView from "../components/RoomView/RoomView"
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import './styles/page.css';

const RoomViewPage = () => {
    const { roomID } = useParams();

    return (
        <>
            <div className="page-container">
                <Navbar />
                <div className="content">
                    <RoomView roomID={roomID} />
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default RoomViewPage;