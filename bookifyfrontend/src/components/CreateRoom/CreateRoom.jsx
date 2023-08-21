import './createRoom.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Button, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import CheckboxSelection from "../CheckboxSelection/CheckboxSelection";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import AvailabilitySelection from "../AvailabilitySelection/AvailabilitySelection";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CreateRoom = ({ roomID }) => {
    const [oldRoom, setOldRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({});
    const [amenitiesActive, setAmenitiesActive] = useState(false);
    const [roomTypeActive, setRoomTypeActive] = useState(false);
    const [unauthenticated, setUnauthenticated] = useState(false);
    const [tempAmenities, setTempAmenities] = useState([]);
    const [tempRoomTypeID, setTempRoomTypeID] = useState(-1);

    const { auth } = useAuth();

    const availabilitySet = newRoom?.availability?.length > 0;

    const preloadRoomInfo = () => {
        if(oldRoom.hostUsername !== auth?.user) setUnauthenticated(true);

        //TODO: preload the required info the newRoom state
    }

    const onSubmit = () => {
        if(unauthenticated) return;

        //TODO: send edit or create request to the backend
    }

    const fetchRoom = async () => {
        try {
            const response = await axios.get(`/room/getRoom/${roomID}`);
            setOldRoom(response?.data ?? null);
        } catch (error) {
            console.log(error);
            setOldRoom(null);
        }
    }

    useEffect(() => {
        if(roomID) fetchRoom(roomID);
    }, [roomID]);

    useEffect(() => {
        if(oldRoom) preloadRoomInfo();
    }, [oldRoom]);

    //TO BE DELETED:
    useEffect(() => {
        console.log(newRoom);
    }, [newRoom]);

    return (
        <div className="create-room-parent">
            <div className="create-room-content">
                    <h1>New Room</h1>

                    <div className="accordion-parent">

                        <Accordion defaultExpanded={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>General Info</Typography>
                                <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>

                                </div>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Space</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <Button
                                        onClick={() => setAmenitiesActive(true)}
                                    >
                                        Select amenities
                                    </Button>

                                    <Button
                                        onClick={() => setRoomTypeActive(true)}
                                    >
                                        Select room type
                                    </Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Availability</Typography>
                                {availabilitySet && <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <AvailabilitySelection
                                        onAvailabilityChanged={(newAvailability) => {
                                            setNewRoom({...newRoom, availability: newAvailability});
                                            console.log(newAvailability);
                                        }}
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Accordion 1</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Accordion 1</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                    </div>
                </div>

            <Dialog
                open={amenitiesActive}
                onClose={() => setAmenitiesActive(false)}
                maxWidth="lg"
            >
                    <DialogTitle
                        style={
                            {
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            } }
                    >
                        Select Amenities

                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={() => setAmenitiesActive(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent className="amenities-popup">

                        <CheckboxSelection
                            title="Amenities"
                            endpointURL="/amenities/getAllAmenities"
                            onFiltersChanged={(newAmenities) => {
                                setTempAmenities(newAmenities);
                            }}
                            defaultData={newRoom?.amenityIDs}
                        />


                        <div className="amenity-popup-button-holder">
                            <button
                                onClick={() => {
                                    setNewRoom({...newRoom, amenityIDs: tempAmenities});
                                    setAmenitiesActive(false);
                                }}
                                className="confirm-amenities-button"
                            >
                                Confirm
                            </button>
                        </div>




                    </DialogContent>


            </Dialog>

            <Dialog
                open={roomTypeActive}
                onClose={() => setRoomTypeActive(false)}
                maxWidth="lg"
            >
                <DialogTitle
                    style={
                        {
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        } }
                >
                    Select Room Type

                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setRoomTypeActive(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="amenities-popup">

                    <CheckboxSelection
                        title="Room Type"
                        endpointURL="/roomType/getAll"
                        onFiltersChanged={(newRoomType) => {
                            setTempRoomTypeID(newRoomType[0]);
                        }}
                        defaultData={newRoom.roomTypeID ? [newRoom.roomTypeID] : undefined}
                        onlyOneOption={true}
                    />


                    <div className="amenity-popup-button-holder">
                        <button
                            onClick={() => {
                                setNewRoom({...newRoom, roomTypeID: tempRoomTypeID});
                                setRoomTypeActive(false);
                            }}
                            className="confirm-amenities-button"
                        >
                            Confirm
                        </button>
                    </div>




                </DialogContent>

            </Dialog>

        </div>
    )
};

export default CreateRoom;