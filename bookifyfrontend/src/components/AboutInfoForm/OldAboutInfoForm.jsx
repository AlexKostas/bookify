import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import "./aboutInfoForm.css";
import useGetUserStats from "../../hooks/useGetUserStats";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const OldAboutInfoForm = ({   username='', initialAboutInfo = '', onSubmit,
                           errorMessage = '', success = false}) => {
    const userRef = useRef();
    const [aboutInfo, setAboutInfo] = useState(initialAboutInfo);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userStats = {
            aboutInfo
        };
        onSubmit(userStats);
    };

    const userData = useGetUserStats(username);

    useEffect(() => {
        if (!userData) return;
        setAboutInfo(userData.aboutInfo);
    }, [userData]);


    return (
        <div className="main">
            {success ? (
                <section>
                    <h1>"About-Me" field updated successfully!</h1>
                    <p>
                        <Link to="/">Go to home page</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p className={errorMessage ? "errmsg" : "offscreen"} aria-live="assertive">
                        {errorMessage}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <label className="about-label" htmlFor="about">Share a bit about yourself, your interests, and your hobbies. We'd love to get to know you better!</label>
                        <textarea
                            id="about"
                            ref={userRef}
                            onChange={(e) => setAboutInfo(e.target.value)}
                            value={aboutInfo}
                            required
                        />
                        <button>
                            <FontAwesomeIcon icon={faEdit} />
                            Edit
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default OldAboutInfoForm;
