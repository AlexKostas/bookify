import useAuth from "../../hooks/useAuth";
import Dropdown from "../Dropdown/Dropdown";
import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { auth } = useAuth();

    return (
        <div className="navbar">
            <div className="navContainer">
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                    <span className="logo">Bookify</span>
                </Link>
                {auth ? <Dropdown username={auth.user} /> : (
                    <div className="navItems">
                        <div className="buttons">
                            <Link to='/register'>
                                <button className="navButton">Register</button>
                            </Link>
                            <Link to='/login'>
                                <button className="navButton">Login</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;