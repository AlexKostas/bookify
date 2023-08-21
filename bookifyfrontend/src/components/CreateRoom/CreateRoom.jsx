import './createRoom.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Button, CircularProgress, Grid} from "@mui/material";
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
import MapInteraction from "../MapInteraction/MapInteraction";
import TextField from "@mui/material/TextField";
import CustomTextarea from "../CustomTextArea/CustomTextarea";

const CreateRoom = ({ roomID }) => {
    const [oldRoom, setOldRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({});
    const [amenitiesActive, setAmenitiesActive] = useState(false);
    const [roomTypeActive, setRoomTypeActive] = useState(false);
    const [unauthenticated, setUnauthenticated] = useState(false);
    const [tempAmenities, setTempAmenities] = useState([]);
    const [tempRoomTypeID, setTempRoomTypeID] = useState(-1);

    const { auth } = useAuth();

    const locationSet = newRoom?.address && newRoom?.neighborhood && newRoom?.city && newRoom?.state && newRoom?.country
        && newRoom?.zipcode && newRoom.latitude && newRoom.longitude && newRoom.transitInfo && newRoom.neighborhoodOverview
    const availabilitySet = newRoom?.availability?.length > 0;
    const rulesSet = newRoom?.minimumStay > 0;
    const submitButtonEnabled = locationSet && availabilitySet && rulesSet;

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

                        {/*LOCATION*/}
                        <Accordion defaultExpanded={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Location</Typography>
                                {locationSet && <CheckCircleIcon style={{color: 'green', marginLeft: '1%'}}/>}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="map-holder">
                                    {

                                        <span>Please click anywhere on the map to set the location</span>
                                    }
                                    <MapInteraction
                                        onClick={ (latitude, longitude, address, neighborhood, city, state, country, postcode) => {
                                            setNewRoom({
                                                ...newRoom,
                                                latitude,
                                                longitude,
                                                address,
                                                neighborhood,
                                                city,
                                                state,
                                                country,
                                                zipcode: postcode,
                                            })
                                        } }
                                    />

                                    {
                                        (newRoom?.latitude && newRoom?.longitude) &&

                                        <div className="location-form">
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} className="form-grid">
                                                    <TextField
                                                        error={!newRoom?.address}
                                                        value={newRoom?.address}
                                                        onChange={(event) => setNewRoom({...newRoom, address: event.target.value})}
                                                        id="outlined-error-helper-text"
                                                        label="Address"
                                                        defaultValue=""
                                                        helperText={!newRoom?.address && "Address is empty"}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: newRoom?.address !== '', // Control whether the label should shrink
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        error={!newRoom?.neighborhood}
                                                        value={newRoom?.neighborhood}
                                                        onChange={(event) => setNewRoom({...newRoom, neighborhood: event.target.value})}
                                                        id="outlined-error-helper-text"
                                                        label="Neiborhood"
                                                        defaultValue=""
                                                        helperText={!newRoom?.neighborhood && "Neighborhood is empty"}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: newRoom?.neighborhood !== '', // Control whether the label should shrink
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        error={!newRoom?.city}
                                                        value={newRoom?.city}
                                                        onChange={(event) => setNewRoom({...newRoom, city: event.target.value})}
                                                        id="outlined-error-helper-text"
                                                        label="City"
                                                        defaultValue=""
                                                        helperText={!newRoom?.city && "City is empty"}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: newRoom?.city !== '', // Control whether the label should shrink
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={5}>
                                                    <TextField
                                                        error={!newRoom?.state}
                                                        value={newRoom?.state}
                                                        onChange={(event) => setNewRoom({...newRoom, state: event.target.value})}
                                                        id="outlined-error-helper-text"
                                                        label="State"
                                                        defaultValue=""
                                                        helperText={!newRoom?.state && "State is empty"}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: newRoom?.state !== '', // Control whether the label should shrink
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={5}>
                                                    <TextField
                                                        error={!newRoom?.country}
                                                        value={newRoom?.country}
                                                        onChange={(event) => setNewRoom({...newRoom, country: event.target.value})}
                                                        id="outlined-error-helper-text"
                                                        label="Country"
                                                        defaultValue=""
                                                        helperText={!newRoom?.country && "Country is empty"}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: newRoom?.country !== '', // Control whether the label should shrink
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={2}>
                                                    <TextField
                                                        error={!newRoom?.zipcode}
                                                        value={newRoom?.zipcode}
                                                        onChange={(event) => setNewRoom({...newRoom, zipcode: event.target.value})}
                                                        id="outlined-error-helper-text"
                                                        label="Zipcode"
                                                        defaultValue=""
                                                        helperText={!newRoom?.country && "Zipcode is empty"}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: newRoom?.zipcode !== '', // Control whether the label should shrink
                                                        }}
                                                    />
                                                </Grid>


                                                <Grid item xs={12}>
                                                    <CustomTextarea
                                                        placeholder='Neighborhood Overview'
                                                        minRows={2}
                                                        maxRows={4}
                                                        onValueChanged={(value) => setNewRoom({...newRoom, neighborhoodOverview: value})}
                                                        emptyError={'Neighborhood Overview is empty'}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <CustomTextarea
                                                        placeholder='Transit Info'
                                                        minRows={2}
                                                        maxRows={4}
                                                        onValueChanged={(value) => setNewRoom({...newRoom, transitInfo: value})}
                                                        emptyError={'Transit Info is empty'}
                                                    />
                                                </Grid>

                                            </Grid>

                                        </div>
                                    }

                                </div>
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
                                <Typography>Rules</Typography>
                                {rulesSet && <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <CustomTextarea
                                            placeholder='General Rules'
                                            minRows={2}
                                            maxRows={4}
                                            onValueChanged={(value) => setNewRoom({...newRoom, rules: value})}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            error={!newRoom?.minimumStay || newRoom?.minimumStay === 0}
                                            value={newRoom?.minimumStay}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, minimumStay: event.target.value })
                                            }
                                            id="minimumStay"
                                            type="number"
                                            fullWidth
                                            label="Minimum Stays"
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                    </div>

                    <button
                        disabled={!submitButtonEnabled}
                        className="register-room-button"
                    >
                        Register Room
                    </button>
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