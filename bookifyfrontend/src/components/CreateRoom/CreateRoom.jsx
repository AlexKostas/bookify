import './createRoom.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Button, CircularProgress, Grid, InputAdornment} from "@mui/material";
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
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Tooltip from "@mui/material/Tooltip";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";

const CreateRoom = ({ roomID }) => {
    const [oldRoom, setOldRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({amenityIDs: []});
    const [amenitiesActive, setAmenitiesActive] = useState(false);
    const [roomTypeActive, setRoomTypeActive] = useState(false);
    const [unauthenticated, setUnauthenticated] = useState(false);
    const [tempAmenities, setTempAmenities] = useState([]);
    const [tempRoomTypeID, setTempRoomTypeID] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const isEditingRoom = oldRoom !== null && oldRoom !== undefined;

    const generalSet = newRoom?.name && newRoom?.summary && newRoom?.description;
    const locationSet = newRoom?.address && newRoom?.neighborhood && newRoom?.city && newRoom?.state && newRoom?.country
        && newRoom?.zipcode && newRoom.latitude && newRoom.longitude && newRoom.transitInfo && newRoom.neighborhoodOverview
    const availabilitySet = newRoom?.availability?.length > 0;
    const spaceSet = newRoom?.nBeds > 0 && newRoom?.nBaths && newRoom?.surfaceArea > 1 && newRoom?.roomTypeID >= 0;
    const pricingSet = newRoom?.pricePerNight > 0 && newRoom?.maxTenants > 0 && newRoom?.extraCostPerTenant;
    const rulesSet = newRoom?.minimumStay > 0;
    const submitButtonEnabled = generalSet && locationSet && spaceSet && pricingSet && availabilitySet && rulesSet;

    const preloadRoomInfo = () => {
        if(oldRoom.hostUsername !== auth?.user) setUnauthenticated(true);

        setNewRoom({
            name: oldRoom.name,
            summary: oldRoom.summary,
            description: oldRoom.description,
            notes: oldRoom.notes,
            address: oldRoom.address,
            neighborhood: oldRoom.neighborhood,
            neighborhoodOverview: oldRoom.neighborhoodOverview,
            transitInfo: oldRoom.transitInfo,
            city: oldRoom.city,
            state: oldRoom.state,
            country: oldRoom.country,
            zipcode: oldRoom.zipcode,
            latitude: oldRoom.latitude,
            longitude: oldRoom.longitude,
            minimumStay: oldRoom.minimumStay,
            rules: oldRoom.rules,
            nBeds: oldRoom.nBeds,
            nBaths: oldRoom.nBaths,
            nBedrooms: oldRoom.nBedrooms,
            surfaceArea: oldRoom.surfaceArea,
            accommodates: oldRoom.accommodates,
            roomTypeID: oldRoom.roomTypeID,
            pricePerNight: oldRoom.pricePerNight,
            maxTenants: oldRoom.maxTenants,
            extraCostPerTenant: oldRoom.extraCostPerTenant,
            amenityIDs: oldRoom.amenityIDs,
        });
    }

    const onSubmit = async () => {
        if(unauthenticated) return;

        const endpointURL = isEditingRoom ? `/room/editRoom/${roomID}` :
            `/room/registerRoom`;

        try {
            setLoading(true);

            await axiosPrivate.post(endpointURL, newRoom);

            navigate('/host');
        } catch (err) {
            if (!err?.response)
                setError('No server response');
            else if (err.response?.status === 400)
                setError('The room creation form has some bad or missing data');
            else if (err.response?.status === 403)
                setError('You do not have the required access for this operation');
            else
                setError('Room creation failed')
        }
        finally {
            setLoading(false);
        }
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
                                {generalSet && <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            error={!newRoom?.name}
                                            value={newRoom?.name}
                                            onChange={(event) => setNewRoom({...newRoom, name: event.target.value})}
                                            id="outlined-error-helper-text"
                                            label="Name"
                                            defaultValue=""
                                            helperText={!newRoom?.name && "Name is empty"}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: newRoom?.name !== '', // Control whether the label should shrink
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <CustomTextarea
                                            placeholder='Summary'
                                            minRows={2}
                                            maxRows={4}
                                            onValueChanged={(value) => setNewRoom({...newRoom, summary: value})}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <CustomTextarea
                                            placeholder='Notes'
                                            minRows={2}
                                            maxRows={4}
                                            onValueChanged={(value) => setNewRoom({...newRoom, notes: value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextarea
                                            placeholder='Description'
                                            minRows={4}
                                            maxRows={6}
                                            onValueChanged={(value) => setNewRoom({...newRoom, description: value})}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/*LOCATION*/}
                        <Accordion>
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
                                                        required={true}
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
                                                        required={true}
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
                                                        required={true}
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
                                                        required={true}
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
                                                        required={true}
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
                                                        required={true}
                                                    />
                                                </Grid>


                                                <Grid item xs={12}>
                                                    <CustomTextarea
                                                        placeholder='Neighborhood Overview'
                                                        minRows={2}
                                                        maxRows={4}
                                                        onValueChanged={(value) => setNewRoom({...newRoom, neighborhoodOverview: value})}
                                                        emptyError={'Neighborhood Overview is empty'}
                                                        required={true}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <CustomTextarea
                                                        placeholder='Transit Info'
                                                        minRows={2}
                                                        maxRows={4}
                                                        onValueChanged={(value) => setNewRoom({...newRoom, transitInfo: value})}
                                                        emptyError={'Transit Info is empty'}
                                                        required={true}
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
                                {spaceSet && <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <TextField
                                            error={!newRoom?.nBeds}
                                            value={newRoom?.nBeds}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, nBeds: event.target.value })
                                            }
                                            id="nBeds"
                                            type="number"
                                            fullWidth
                                            label="Beds"
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            error={!newRoom?.nBaths}
                                            value={newRoom?.nBaths}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, nBaths: event.target.value })
                                            }
                                            id="nBaths"
                                            type="number"
                                            fullWidth
                                            label="Bathrooms"
                                            inputProps={{
                                                step: 1,
                                                min: 0,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            error={!newRoom?.surfaceArea}
                                            value={newRoom?.surfaceArea}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, surfaceArea: event.target.value })
                                            }
                                            id="surfaceArea"
                                            type="number"
                                            fullWidth
                                            label="Surface Area"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">ft²</InputAdornment>,
                                            }}
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            error={!newRoom?.accommodates}
                                            value={newRoom?.accommodates}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, accommodates: event.target.value })
                                            }
                                            id="accommodates"
                                            type="number"
                                            fullWidth
                                            label="Accommodates"
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                </Grid>
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

                        {/* Pricing */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Pricing</Typography>
                                {pricingSet && <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <TextField
                                            error={!newRoom?.pricePerNight}
                                            value={newRoom?.pricePerNight}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, pricePerNight: event.target.value })
                                            }
                                            id="pricePerNight"
                                            type="number"
                                            fullWidth
                                            label="Price per Night"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                            }}
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            error={!newRoom?.maxTenants}
                                            value={newRoom?.maxTenants}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, maxTenants: event.target.value })
                                            }
                                            id="maxTenants"
                                            type="number"
                                            fullWidth
                                            label="Max Tenants"
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                'aria-labelledby': 'input-error-helper-text'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            error={!newRoom?.extraCostPerTenant}
                                            value={newRoom?.extraCostPerTenant}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, extraCostPerTenant: event.target.value })
                                            }
                                            id="extraCostPerTenant"
                                            type="number"
                                            fullWidth
                                            label="Extra Cost Per Tenant"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                            }}
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
                                    <Grid item xs={9}>
                                        <CustomTextarea
                                            placeholder='General Rules'
                                            minRows={2}
                                            maxRows={4}
                                            onValueChanged={(value) => setNewRoom({...newRoom, rules: value})}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            error={!newRoom?.minimumStay}
                                            value={newRoom?.minimumStay}
                                            onChange={(event) =>
                                                setNewRoom({ ...newRoom, minimumStay: event.target.value })
                                            }
                                            id="minimumStay"
                                            type="number"
                                            fullWidth
                                            label="Minimum Stay"
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

                    <Tooltip
                        title={submitButtonEnabled ? 'Create Room' : 'Please fill in all the required fields'}
                        placement="top"
                        arrow
                    >
                        <button
                            disabled={!submitButtonEnabled}
                            onClick={() => onSubmit()}
                            className="register-room-button"
                        >
                            {loading ? <CircularProgress /> : 'Create Room'}
                        </button>
                    </Tooltip>


                {
                    error &&
                    <div
                        style={{display: 'flex', flexDirection: 'row', gap: '1%', alignItems: 'center', justifyContent: 'center', marginTop: '1%'}}>
                        <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#ff0000", marginRight: '0'}}/>
                        {error}
                    </div>
                }
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