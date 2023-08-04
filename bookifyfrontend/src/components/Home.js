import Navbar from "./Navbar/Navbar";
import SearchBar from "./SearchBar/SearchBar";
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

    const endpointURL = '/search/searchAll';

    return (
        <>
        <Navbar />
        <SearchBar />
        <br />
        <h1>Rooms you may like</h1>
        <br />
        <RoomGrid endpointURL={endpointURL} />
        </>   
    )
}

export default Home