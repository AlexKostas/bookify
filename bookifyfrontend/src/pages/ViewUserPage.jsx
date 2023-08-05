import { useParams } from "react-router-dom"

const ViewUserPage = () => {
    const { username } = useParams();

    return (
        <p>Currently viewing user with username {username}</p>
    );
}

export default ViewUserPage;