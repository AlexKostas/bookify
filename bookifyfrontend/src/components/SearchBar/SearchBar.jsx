import {
    faBed,
    faCalendarDays,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./searchbar.css";
import { DateRange } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import SearchField from "../SearchField/SearchField";
import {useSearchContext} from "../../context/SearchContext";

const SearchBar = ({ type }) => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        people: 1,
    });

    const navigate = useNavigate();
    const { searchInfo, setSearchInfo } = useSearchContext();

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            };
        });
    };

    const handleSearch = () => {
        //TODO: make sure all parameters are set

        setSearchInfo({
            location: "Athens",
            checkInDate: 'hi',
            checkOutDate: 'bye',
            people: 4
        });

        navigate('/search');
    };

    return (
        <div className="header">
            <div
                className={
                    type === "list" ? "headerContainer listMode" : "headerContainer"
                }
            >
                {type !== "list" && (
                    <>
                        <div className="headerSearch">
                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                                <SearchField className="headerSearchInput" />
                            </div>

                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                                <span
                                    onClick={() => setOpenDate(!openDate)}
                                    className="headerSearchText"
                                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                                    dates[0].endDate,
                                    "MM/dd/yyyy"
                                )}`}</span>
                                {openDate && (
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={(item) => setDates([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dates}
                                        className="date"
                                        minDate={new Date()}
                                    />
                                )}
                            </div>


                            <div className="headerSearchItem">
                                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                                <span
                                    onClick={() => setOpenOptions(!openOptions)}
                                    className="headerSearchText"
                                >{`${options.people} ${options.people > 1 ? 'people' : 'person'}`}</span>
                                {openOptions && (
                                    <div className="options">
                                        <div className="optionItem">
                                            <span className="optionText">People:</span>
                                            <div className="optionCounter">
                                                <button
                                                    disabled={options.people <= 1}
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("people", "d")}
                                                >
                                                    -
                                                </button>
                                                <span className="optionCounterNumber">
                          {options.people}
                        </span>
                                                <button
                                                    className="optionCounterButton"
                                                    onClick={() => handleOption("people", "i")}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="headerSearchItem">
                                <button className="headerBtn" onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchBar;