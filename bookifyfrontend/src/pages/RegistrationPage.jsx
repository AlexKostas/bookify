import Navbar from "../components/Navbar/Navbar";
import RegistrationForm from "../components/RegistrationForm/RegistrationForm";

const RegistrationPage = () => {
    return (
        <>
            <Navbar />
            <h1>Register</h1>
            <RegistrationForm showPassword/>
        </>
    )
}

export default RegistrationPage;