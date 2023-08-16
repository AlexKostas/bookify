import { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './loginform.css';

// The login api endpoint URL
const LOGIN_URL = '/registration/login';

const LoginForm = () => {
    const { setAuth } = useAuth();
    const { setItem } = useLocalStorage();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "";
    const redirected = location.state?.redirected ?? false;

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(
                    {
                        usernameOrEmail: username,
                        password
                    }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const responseUsername = response?.data?.username;
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const roles = response?.data?.roles;
            
            setAuth({ user: responseUsername, accessToken, refreshToken, roles });
            setItem('refreshToken', refreshToken);

            setUsername('');
            setPassword('');

            // Return back to original page if user has been redirected to login page
            // otherwise redirect to appropriate page based on user role
            if (redirected)
                navigate(from, { replace: true });
            else{
                if(roles.includes('admin'))
                    navigate('/admin');
                else if(roles.includes('host') || roles.includes('inactive-host'))
                    navigate('/host');   
                else
                    navigate('/');   
            }
        } catch (err) { // Error handling logic
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <div className='login-container'>
            <div className='login-form'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        required
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <button>Sign In</button>
                </form>
                <p>
                    Need an Account?<br />
                    <span className="line">
                        <Link to="/register">Sign Up</Link>
                    </span>
                </p>
            </div>
        </div>

    )
}

export default LoginForm