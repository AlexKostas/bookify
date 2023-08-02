import Navbar from "../components/Navbar/Navbar";
import RegistrationForm from "../components/RegistrationForm/RegistrationForm";
import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";


const REGISTER_URL = '/registration/register';

const RegistrationPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { setAuth } = useAuth();
    const { setItem } = useLocalStorage();

    const submitRegistrationRequest = async (userInfo) => {
        try {
            const response = await axios.post(REGISTER_URL,
                    JSON.stringify(
                        { 
                            username: userInfo.user, 
                            password: userInfo.pwd,
                            firstName: userInfo.firstName,
                            lastName: userInfo.lastName,
                            email : userInfo.email,
                            phoneNumber: userInfo.phoneNumber,
                            preferredRoles: userInfo.selectedRole
                        }
                    )
                );

                const responseUsername = response?.data?.username;
                const accessToken = response?.data?.accessToken;
                const refreshToken = response?.data?.refreshToken;
                const roles = response?.data?.roles;
                
                setAuth({ user: responseUsername, accessToken, refreshToken, roles });
                setItem('refreshToken', refreshToken);

                setSuccess(true);
            }
            catch(err) {
                let errorMessage = '';
                if (!err?.response)
                    errorMessage = 'No Server Response';
                else if (err.response?.status === 409) 
                    errorMessage = 'Username or Email is taken';
                else
                    errorMessage = 'Registration Failed'

                setError(errorMessage)
                console.log(err);
            }
    }

    return (
        <>
            <Navbar />
            <h1>Register</h1>
            <RegistrationForm onSubmit={submitRegistrationRequest} errorMessage={error}
                success={success} />
        </>
    )
}

export default RegistrationPage;