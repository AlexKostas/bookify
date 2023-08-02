import { useParams } from "react-router-dom";

const RoomViewPage = () => {
    const { roomID } = useParams();

    return (
        <p>Currently viewing room with id {roomID}</p>
    );
}

export default RoomViewPage;