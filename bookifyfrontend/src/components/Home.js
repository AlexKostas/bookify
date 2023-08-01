import Navbar from "./Navbar/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
        <Navbar />
        <section>
            <h1>Home</h1>
            <br />
            <Link to="/editor">Go to the Editor page</Link>
            <br />
            <Link to="/admin">Go to the Admin page</Link>
            <br />
            <Link to="/lounge">Go to the Lounge</Link>
            <br />
            <Link to="/linkpage">Go to the link page</Link>
        </section>
        </>   
    )
}

export default Home