import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./registrationForm.css"

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{4,24}$/;

const ChangePasswordForm = ({onSubmit, errorMessage = '', success = false}) => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [oldPwd, setOldPwd] = useState('');
    const [validOldPwd, setValidOldPwd] = useState(false);
    const [oldPwdFocus, setOldPwdFocus] = useState(false);

    useEffect(() => {
        setValidOldPwd(PWD_REGEX.test(oldPwd));
    }, [oldPwd]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    useEffect(() => {
        setErrMsg(errorMessage);
    }, [errorMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const v = PWD_REGEX.test(pwd);

        if ( !v){
            setErrMsg("Invalid Entry");
            return;
        }

        const userDetails = {
            user,
            oldPwd,
            pwd
        };
        onSubmit(userDetails);

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
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

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
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
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
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
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

                        <button disabled={!validPwd}>Change Password</button>

                    </form>
                </section>
            </div>
        </>
    );
}

export default ChangePasswordForm