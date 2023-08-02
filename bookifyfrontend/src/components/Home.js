import Navbar from "./Navbar/Navbar";
import { Link } from "react-router-dom";
import RoomGrid from "./RoomGrid/RoomGrid";

const Home = () => {
    const roomResults = [
    {
      id: 1,
      name: 'Cozy Studio Apartment',
      rating: 4.3,
      price: 100,
      image: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg?w=2000'
    },
    {
      id: 2,
      name: 'Luxury Beach House',
      rating: 1.5,
      price: 250,
      image: 'data:image/jpeg;base64,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'
    },
  ];

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
        <RoomGrid rooms={roomResults} />
        </>   
    )
}

export default Home