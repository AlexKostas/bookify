import LoginForm from "../components/LoginForm/LoginForm";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../Footer/Footer";

const LoginPage = () => {
    return (
        <>
            <Navbar hideButtons={true}/>
            <LoginForm />
            <Footer/>
        </>
    );
}

export default LoginPage;