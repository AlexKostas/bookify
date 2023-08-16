import UserGrid from '../components/UserGrid/UserGrid';
import Navbar from '../components/Navbar/Navbar';
import {useSearchContext} from "../context/SearchContext";
import {useEffect} from "react";

const AdminPage = () => {
    const { resetSearch } = useSearchContext();

    useEffect(() => {
        resetSearch();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Admin Dashboard</h1>
            <UserGrid />
        </div>
    );
}

export default AdminPage;