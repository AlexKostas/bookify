import UserGrid from '../components/UserGrid/UserGrid';
import Navbar from '../components/Navbar/Navbar';

const AdminPage = () => {
    return (
        <div>
            <Navbar />
            <h1>Admin Page</h1>
            <UserGrid />
        </div>
    );
}

export default AdminPage;