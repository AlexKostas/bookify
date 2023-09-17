import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm/RegistrationForm";
import Footer from "../components/Footer/Footer";
import './styles/page.css';

const REGISTER_URL = '/registration/register';

const RegistrationPage = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();

    const navigate = useNavigate();

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

                if(roles.includes('admin'))
                    navigate('/admin');
                else if(roles.includes('host') || roles.includes('inactive-host'))
                    navigate('/host');   
                else
                    navigate('/');         
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
            <div className="page-container">
            <Navbar />
                <div className="content">
                    <RegistrationForm onSubmit={submitRegistrationRequest} errorMessage={error}
                                      success={success} />
                </div>
                <Footer />
            </div>
        </>
    )
}

export default RegistrationPage;