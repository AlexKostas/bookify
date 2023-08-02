import Navbar from "./Navbar/Navbar";
import { Link } from "react-router-dom";
import RoomGrid from "./RoomGrid/RoomGrid";

const Home = () => {
    const roomResults = [
    {
      roomID: 1,
      name: 'Cozy Studio Apartment',
      rating: 4.3,
      reviewCount: 32,
      bedCount: 2,
      price: 100,
      roomType: "Private Room",
      image: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg?w=2000'
    },
    {
      roomID: 2,
      name: 'Cozy Studio Apartment',
      rating: 4.3,
      reviewCount: 32,
      bedCount: 2,
      price: 100,
      roomType: "Private Room",
      image: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg?w=2000'
    },
    {
      roomID: 3,
      name: 'Cozy Studio Apartment',
      rating: 4.3,
      reviewCount: 32,
      bedCount: 2,
      price: 100,
      roomType: "Private Room",
      image: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg?w=2000'
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
        <h1>Rooms you may like</h1>
        <br />
        <RoomGrid rooms={roomResults} />
        </>   
    )
}

export default Home