import { useParams } from "react-router-dom"
import UserView from "../components/UserView/UserView"
import Navbar from "../components/Navbar/Navbar";

const ViewUserPage = () => {
    const { username } = useParams();

    return (
        <>
            <Navbar />
            <UserView username={username} />
        </>
    );
}

export default ViewUserPage;