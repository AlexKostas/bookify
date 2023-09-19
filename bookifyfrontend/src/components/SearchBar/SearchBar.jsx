import {
    faCalendarDays,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./searchbar.css";
import { DateRange } from "react-date-range";
import {useEffect, useRef, useState} from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import SearchField from "../SearchField/SearchField";
import {useSearchContext} from "../../context/SearchContext";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import {useFilterOptions} from "../../context/FilterOptionsContext";

const SearchBar = ({ type }) => {
    const [destinationItems, setDestinationItems] = useState("");
    const {setItem} = useLocalStorage();
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
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    const {setSearchInfo} = useSearchContext();
    const { resetState } = useFilterOptions();

    const dateRef = useRef();
    const optionsRef = useRef();

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            };
        });
    };

    const handleSearch = () => {
        if (destinationItems === "" || dates[0].startDate === undefined || dates[0].endDate === undefined) {
            setError(true);
            return;
        }

        const newSearchInfo = {
            checkInDate: dates[0].startDate,
            checkOutDate: dates[0].endDate,
            tenants: options.people,
            city: destinationItems[0],
            state: destinationItems[1],
            country: destinationItems[2],
        }

        setSearchInfo(newSearchInfo);
        setItem("searchInfo", JSON.stringify(newSearchInfo));

        resetState();

        navigate('/search');
    };

    const onLocationSelection = (value) => {
        setDestinationItems(value);
    }

    const handleClickOutside = (event) => {
        if (dateRef.current && !dateRef.current.contains(event.target)) {
            setOpenDate(false);
        }

        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setOpenOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setError(false);
    }, [destinationItems, dates, options]);

    let headerSearchError = 'headerSearchError';
    return (
        <div className="search-header-container">
            <div className="header">
                <div className={`headerSearch ${error && headerSearchError}`}>

                    <div className="headerSearchItem location-bar">
                        <SearchField
                            onSelection={onLocationSelection}
                            className="headerSearchInput"
                        />
                    </div>

                    <div className="headerSearchItem calendar-selection" ref={dateRef}>
                        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon"/>
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

                    <div className="headerSearchItem people-options" ref={optionsRef}>
                        <FontAwesomeIcon icon={faPerson} className="headerIcon"/>
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

                    <div className="headerSearchItem search-button-container">
                        <button className="headerBtn" onClick={handleSearch}>
                            Search
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SearchBar;