import LoginForm from "../components/LoginForm/LoginForm";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import './styles/page.css';

const LoginPage = () => {
    return (
        <>
            <div className="page-container">
            <Navbar />
                <div className="content">
                    <LoginForm />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default LoginPage;