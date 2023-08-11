import { useParams } from "react-router-dom"
import RoomView from "../components/RoomView/RoomView"
import Navbar from "../components/Navbar/Navbar";

const RoomViewPage = () => {
    const { roomID } = useParams();

    return (
        <>
            <Navbar />
            <RoomView roomID={roomID} />
        </>
    );
}

export default RoomViewPage;