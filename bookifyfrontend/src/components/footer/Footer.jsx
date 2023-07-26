import "./footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="fLists">
                <ul className="fList">
                    <li className="fListItem">Countries</li>
                    <li className="fListItem">Regions</li>
                    <li className="fListItem">Cities</li>
                    <li className="fListItem">Hotels</li>
                </ul>
                <ul className="fList">
                    <li className="fListItem">Homes </li>
                    <li className="fListItem">Apartments </li>
                    <li className="fListItem">Resorts </li>
                    <li className="fListItem">Hostels</li>
                    <li className="fListItem">Guest houses</li>
                </ul>
                <ul className="fList">
                    <li className="fListItem">Unique places to stay </li>
                    <li className="fListItem">Reviews</li>
                    <li className="fListItem">Unpacked: Travel articles </li>
                    <li className="fListItem">Seasonal and holiday deals </li>
                </ul>
                <ul className="fList">
                    <li className="fListItem">Partner Help</li>
                    <li className="fListItem">Careers</li>
                    <li className="fListItem">Sustainability</li>
                    <li className="fListItem">Safety Resource Center</li>
                    <li className="fListItem">Terms & conditions</li>
                </ul>
            </div>
            <div className="fText">Copyright © 2023 Bookify.com</div>
        </div>
    );
};

export default Footer;