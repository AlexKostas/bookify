import LoginForm from "../components/LoginForm/LoginForm";
import Navbar from "../components/Navbar/Navbar";

const LoginPage = () => {
    return (
        <>
            <Navbar hideButtons={false}/>
            <LoginForm />
        </>
    );
}

export default LoginPage;