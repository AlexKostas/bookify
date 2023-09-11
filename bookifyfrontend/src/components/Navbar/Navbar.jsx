import useAuth from "../../hooks/useAuth";
import Dropdown from "../Dropdown/Dropdown";
import "./navbar.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const Navbar = ({image}) => {
    const { auth } = useAuth();

    return (
        <div className="navbar">
            <div className="navContainer">
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                    <span className="logo">Bookify</span>
                </Link>
                {auth ? (
                    <Dropdown username={auth.user} image={image} />
                ) : (
                        <div className="navItems">
                            <div className="buttons">
                                <Link to="/register">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        style={{
                                            backgroundColor: 'white',
                                            color: '#003580',
                                            borderColor: '#003580',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Register
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        style={{
                                            backgroundColor: 'white',
                                            color: '#003580',
                                            borderColor: '#003580',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Navbar;