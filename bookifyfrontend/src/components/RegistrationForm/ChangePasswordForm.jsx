// ChangePasswordForm.jsx
import React, {useEffect, useRef, useState} from 'react';
import useAuth from '../../hooks/useAuth';
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import "./registrationForm.css"


const PASSWORD_UPDATE_URL = "/user/changePassword";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,24}$/;

const ChangePasswordForm = () => {
    const [error, setError] = useState('');
    const { auth, setAuth } = useAuth();
    const { setItem } = useLocalStorage();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const errRef = useRef();
    const [user, setUser] = useState();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [oldPwd, setOldPwd] = useState('');
    const [validOldPwd, setValidOldPwd] = useState(false);
    const [oldPwdFocus, setOldPwdFocus] = useState(false);

    const [pwdChanged, setPwdChanged] = useState(true);

    useEffect(() => {
        setValidOldPwd(PWD_REGEX.test(oldPwd));
    }, [oldPwd]);

    useEffect(() => {
        setPwdChanged(oldPwd !== pwd);
    }, [pwd])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd) && pwdChanged);
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd, pwdChanged])


    const handleChangePassword = async (userInfo) => {
        try {
            const response = await axiosPrivate.put(PASSWORD_UPDATE_URL,
                JSON.stringify(
                    {
                        username: auth.user,
                        oldPassword: userInfo.oldPwd,
                        newPassword: userInfo.pwd,
                    }
                )
            );

            const responseUsername = response?.data?.username;
            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const roles = response?.data?.roles;

            setAuth({ user: responseUsername, accessToken, refreshToken, roles });
            setItem('refreshToken', refreshToken);

            navigate('/profile');
        }
        catch(err) {
            let errorMessage = '';
            if (!err?.response)
                errorMessage = 'No Server Response';
            else if (err.response?.status === 400)
                errorMessage = 'New password can not be the same as old password';
            else if (err.response?.status === 403)
                errorMessage = 'Old password is not correct';
            else
                errorMessage = 'Password change Failed'

            setError(errorMessage)
            console.log(err);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const v = PWD_REGEX.test(pwd);

        if ( !v){
            setError("Invalid Entry");
            return;
        }

        const userDetails = {
            user,
            oldPwd,
            pwd
        };
        await handleChangePassword(userDetails);

        //Clear state
        //setUser('');
        setPwd('');
        setMatchPwd('');
        setOldPwd('');

    }

    return (
        <>
            <div className="main">
                <section>
                    <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive">{error}</p>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="old_password">
                            Old password:
                            <FontAwesomeIcon icon={faCheck} className={validOldPwd && oldPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validOldPwd || !oldPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="old_password"
                            onChange={(e) => setOldPwd(e.target.value)}
                            value={oldPwd}
                            required
                            aria-invalid={validOldPwd ? "false" : "true"}
                            aria-describedby="oldpwdnote"
                            onFocus={() => setOldPwdFocus(true)}
                            onBlur={() => setOldPwdFocus(false)}
                        />
                        <p id="oldpwdnote" className={oldPwdFocus && !validOldPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter your old password.
                        </p>
                        <label htmlFor="password">
                            New password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            New password must not be the same with <br/>
                            the old password. <br/>
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm new password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd && validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={(validMatch && validPwd) || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match with the new password.
                        </p>

                        <button disabled={!validPwd || !validMatch}>Change Password</button>

                    </form>
                </section>
            </div>
        </>
    );
};

export default ChangePasswordForm;