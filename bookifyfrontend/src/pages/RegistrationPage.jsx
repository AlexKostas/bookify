import Navbar from "../components/Navbar/Navbar";
import RegistrationForm from "../components/RegistrationForm/RegistrationForm";

const RegistrationPage = () => {
    return (
        <>
            <Navbar />
            <RegistrationForm showPassword/>
        </>
    )
}

export default RegistrationPage;