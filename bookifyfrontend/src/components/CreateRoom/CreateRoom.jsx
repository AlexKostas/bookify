import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Button,
    CircularProgress,
    ClickAwayListener,
    Grid,
    ImageList,
    ImageListItem,
    InputAdornment
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
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
import {faCircleExclamation, faUpload, faEdit} from "@fortawesome/free-solid-svg-icons";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as React from "react";
import './createRoom.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useFetchImages from "../../hooks/useFetchImages";


const CreateRoom = ({ roomID }) => {
    const [oldRoom, setOldRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({amenityIDs: []});

    const [amenitiesActive, setAmenitiesActive] = useState(false);
    const [roomTypeActive, setRoomTypeActive] = useState(false);

    const [unauthenticated, setUnauthenticated] = useState(false);

    const [tempAmenities, setTempAmenities] = useState([]);
    const [tempRoomTypeID, setTempRoomTypeID] = useState(-1);

    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [thumbnailToSend, setThumbnailToSend] = useState(null);

    const [currentImages, setCurrentImages] = useState([]);
    const [imagesToSend, setImagesToSend] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const [bookedDays, setBookedDays] = useState([]);
    const [bookedRanges, setBookedRanges] = useState([]);

    const thumbnailInputRef = useRef();
    const imageInputRef = useRef();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { fetchImages } = useFetchImages();

    const isEditingRoom = oldRoom !== null && oldRoom !== undefined;

    const generalSet = newRoom?.name && newRoom?.summary && newRoom?.description;
    const locationSet = newRoom?.address && newRoom?.neighborhood && newRoom?.city && newRoom?.state && newRoom?.country
        && newRoom?.zipcode && newRoom.latitude && newRoom.longitude && newRoom.transitInfo && newRoom.neighborhoodOverview
    const availabilitySet = newRoom?.availability?.length > 0;
    const spaceSet = newRoom?.nBeds > 0 && newRoom?.nBaths && newRoom?.surfaceArea > 1 && newRoom?.roomTypeID >= 0 && newRoom?.nBedrooms > 0;
    const pricingSet = newRoom?.pricePerNight > 0 && newRoom?.maxTenants > 0 && newRoom?.extraCostPerTenant;
    const rulesSet = newRoom?.minimumStay > 0;
    const imagesSet = selectedThumbnail !== null && selectedThumbnail !== undefined;
    const submitButtonEnabled = generalSet && locationSet && spaceSet && pricingSet
        && availabilitySet && rulesSet && imagesSet;

    const removeItemFromArray = (array, index) => {
        if(array.length === 1) return [];

        return array.slice(0, index).concat(array.slice(index + 1));
    }

    const imageInImagesToSend = (image) => {
        return imagesToSend.some(item => item.url === image);
    }

    const preloadRoomInfo = async () => {
        if(oldRoom.hostUsername !== auth?.user) {
            setUnauthenticated(true);
            return;
        }

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

        setBookedDays(oldRoom.bookedDays);
        setBookedRanges(oldRoom.bookedRanges);

        const thumbnail = await fetchImages([`/roomPhotos/get/${oldRoom.thumbnailGuid}`]);
        setSelectedThumbnail(thumbnail[0]);

        const urls = oldRoom.photosGUIDs.map((guid) => `/roomPhotos/get/${guid}`);
        const images = await fetchImages(urls);
        setCurrentImages(images);
    }

    const deleteImage = async (url) => {
        try {
            await axiosPrivate.delete(url);

            setError('');
        }
        catch(err) {
            console.log(err);

            if (!err?.response)
                setError('No Server Response');
            else if (err.response?.status === 403)
                setError('You do not have permission to perform this operation');
            else if (err.response?.status === 404)
                setError('Image not found');
            else
                setError('Deleting profile picture failed. Check the console for more details');

            throw new Error("ImageUploadError");
        }
    }

    const uploadImage = async (image, url) => {
        const formData = new FormData();
        formData.append('file', image);
        console.log(formData);

        try {
            await axiosPrivate.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setError('');
        }
        catch(err) {
            console.log(err);

            if (!err?.response)
                setError('No Server Response');
            else if (err.response?.status === 400)
                setError('Only “jpg” and “png” image file formats are accepted');
            else if (err.response?.status === 500)
                setError('Internal server error');
            else
                setError('Uploading image failed. Check the sonsole for more details');

            throw new Error("ImageUploadError");
        }
    }

    const uploadImages = () => {
        imagesToSend.map((image) => {
            uploadImage(image.file, `roomPhotos/addPhoto/${roomID}`);
        });
    }

    const deleteImages = () => {
        imagesToDelete.map((guid) => deleteImage(`roomPhotos/delete/${guid}/${roomID}`));
    }

    const onSubmit = async () => {
        if(unauthenticated) return;

        const endpointURL = isEditingRoom ? `/room/editRoom/${roomID}` :
            `/room/registerRoom`;

        try {
            setLoading(true);

            const response = isEditingRoom ? await axiosPrivate.put(endpointURL, newRoom) :
                await axiosPrivate.post(endpointURL, newRoom);

            roomID = response.data

            if(thumbnailToSend) await uploadImage(thumbnailToSend, `roomPhotos/addThumbnail/${roomID}`);
            uploadImages();
            deleteImages();

            navigate('/host');
        } catch (err) {
            if(err?.message === "ImageUploadError") return;

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
            const response = await axios.get(`/room/getRoom/${roomID}?getBookedDays=true`);
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

    return (
        (unauthenticated === true) ? (<h1>You do not have access to edit this room</h1>) :
            <div className="create-room-parent">
                    <div className="create-room-content">
                        {isEditingRoom ? <h1>Edit Room</h1> : <h1>New Room</h1>}

                        <div className="accordion-parent">

                            {/*General Info*/}
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
                                                initValue={newRoom?.summary}
                                                required={true}
                                                emptyError= {newRoom?.summary ? '' : "Summary not set"}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <CustomTextarea
                                                placeholder='Notes'
                                                minRows={2}
                                                maxRows={4}
                                                onValueChanged={(value) => setNewRoom({...newRoom, notes: value})}
                                                initValue={newRoom?.notes}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomTextarea
                                                placeholder='Description'
                                                minRows={4}
                                                maxRows={6}
                                                onValueChanged={(value) => setNewRoom({...newRoom, description: value})}
                                                initValue={newRoom?.description}
                                                required={true}
                                                emptyError= {newRoom?.description ? '' : "Description not set"}
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
                                            initValues={isEditingRoom && {lat: oldRoom?.latitude, lng: oldRoom?.longitude}}
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
                                                            initValue={newRoom?.neighborhoodOverview}
                                                            required={true}
                                                            emptyError= {newRoom?.neighborhoodOverview ? '' : "'Neighborhood Overview is empty'"}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <CustomTextarea
                                                            placeholder='Transit Info'
                                                            minRows={2}
                                                            maxRows={4}
                                                            onValueChanged={(value) => setNewRoom({...newRoom, transitInfo: value})}
                                                            required={true}
                                                            initValue={newRoom?.transitInfo}
                                                            emptyError= {newRoom?.transitInfo ? '' : "'Transit info is empty'"}
                                                        />
                                                    </Grid>

                                                </Grid>

                                            </div>
                                        }

                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            {/*Space*/}
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
                                                    'aria-labelledby': 'input-error-helper-text',
                                                }}
                                                InputLabelProps={{
                                                    shrink: newRoom?.nBeds !== '', // Control whether the label should shrink
                                                }}
                                                required={true}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                error={!newRoom?.nBedrooms}
                                                value={newRoom?.nBedrooms}
                                                onChange={(event) =>
                                                    setNewRoom({ ...newRoom, nBedrooms: event.target.value })
                                                }
                                                id="nBeds"
                                                type="number"
                                                fullWidth
                                                label="Bedrooms"
                                                inputProps={{
                                                    step: 1,
                                                    min: 1,
                                                    'aria-labelledby': 'input-error-helper-text',
                                                }}
                                                InputLabelProps={{
                                                    shrink: newRoom?.nBedrooms !== '', // Control whether the label should shrink
                                                }}
                                                required={true}
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
                                                    'aria-labelledby': 'input-error-helper-text',
                                                }}
                                                InputLabelProps={{
                                                    shrink: newRoom?.nBaths !== '', // Control whether the label should shrink
                                                }}
                                                required={true}
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
                                                    'aria-labelledby': 'input-error-helper-text',
                                                    shrink: newRoom?.surfaceArea !== ''
                                                }}
                                                required={true}
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
                                                InputLabelProps={{
                                                    shrink: newRoom?.accomodates !== '', // Control whether the label should shrink
                                                }}
                                                required={true}
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
                                                required={true}
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
                                                InputLabelProps={{
                                                    shrink: newRoom?.maxTenants !== '', // Control whether the label should shrink
                                                }}
                                                required={true}
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
                                                required={true}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/*Availability*/}
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
                                            bookedDays={bookedDays}
                                            bookedRanges={bookedRanges}
                                        />
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            {/*Rules*/}
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
                                                placeholder='Rules'
                                                minRows={2}
                                                maxRows={4}
                                                onValueChanged={(value) => setNewRoom({...newRoom, rules: value})}
                                                initValue={newRoom?.rules}
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
                                                InputLabelProps={{
                                                    shrink: newRoom?.minimumStay !== '', // Control whether the label should shrink
                                                }}
                                                required={true}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/*Images*/}
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Images</Typography>
                                    {imagesSet && <CheckCircleIcon style={{ color: 'green', marginLeft: '1%' }} />}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2} className="image-section-parent">
                                        <Grid item xs={6}>
                                            <div className="thumbnail-container">

                                                <button
                                                    onClick={() => thumbnailInputRef.current.click()}
                                                    className={"select-thumbnail"}
                                                >

                                                    {
                                                        selectedThumbnail ?
                                                            <div className="thumbnail-photo-container">
                                                                <h3>Thumbnail</h3>

                                                                <img
                                                                    className={`thumbnail-pic`}
                                                                    src={selectedThumbnail}
                                                                    alt="Could not load thumbnail"
                                                                />

                                                                <div>
                                                                    <CloudUploadIcon className="thumbnail-overlay"/>
                                                                </div>

                                                            </div> :

                                                            <div className="no-thumbnail-container">

                                                                <span className="add-thumbnail-prompt">Click to add thumbnail...</span>
                                                                <CloudUploadIcon className="thumbnail-upload-icon" />

                                                            </div>
                                                    }

                                                    <input
                                                        style={{display: 'none'}}
                                                        ref={thumbnailInputRef}
                                                        type="file"
                                                        accept=".png, .jpg"
                                                        onChange={(event) => {
                                                            if(!event.target.files) return;

                                                            const imageData = URL.createObjectURL(event.target.files[0]);
                                                            setSelectedThumbnail(imageData);
                                                            setThumbnailToSend(event.target.files[0]);
                                                        }}
                                                    />
                                                </button>

                                                {
                                                    selectedThumbnail &&
                                                    <Tooltip title="Remove thumbnail" placement="top" arrow>
                                                        <IconButton
                                                            onClick={() => {
                                                                setSelectedThumbnail(null);
                                                            }}
                                                            style={{ color: 'red' }}
                                                            className="thumbnail-delete-button"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>

                                            <div className="image-selection-parent">
                                                <input
                                                    style={{display: 'none'}}
                                                    ref={imageInputRef}
                                                    type="file"
                                                    accept=".png, .jpg"
                                                    onChange={(event) => {
                                                        if(!event.target.files) return;

                                                        const imageData = URL.createObjectURL(event.target.files[0]);
                                                        setCurrentImages([...currentImages, imageData]);
                                                        setImagesToSend([...imagesToSend, {
                                                            file: event.target.files[0],
                                                            url: imageData
                                                        }])
                                                    }}
                                                />

                                                {
                                                    currentImages.length > 0 ?
                                                        <>
                                                            <ClickAwayListener onClickAway={() => setSelectedIndex(-1)}>

                                                                <ImageList cols={3} rowHeight={'auto'} className="image-grid">
                                                                    {currentImages.map((item, index) => (
                                                                        <ImageListItem key={index}>
                                                                            <button
                                                                                className={`image-select-button`}
                                                                                onClick={() => setSelectedIndex(index)}
                                                                            >
                                                                                <img
                                                                                    src={`${item}`}
                                                                                    alt={item.title}
                                                                                    loading="lazy"
                                                                                    className={`image-grid-item ${selectedIndex === index ?
                                                                                        'highlighted-button' : ''}`}
                                                                                />
                                                                            </button>
                                                                        </ImageListItem>
                                                                    ))}
                                                                </ImageList>

                                                            </ClickAwayListener>
                                                            <div className="image-selection-actions">
                                                                <Tooltip title="Delete Image" placement="top" arrow>
                                                                    <IconButton
                                                                        disabled={selectedIndex < 0}
                                                                        onClick={() => {
                                                                            if(imageInImagesToSend(currentImages[selectedIndex]))
                                                                                setImagesToSend(removeItemFromArray(imagesToSend, selectedIndex));
                                                                            else
                                                                                oldRoom && setImagesToDelete([...imagesToDelete, oldRoom.photosGUIDs[selectedIndex]]);

                                                                            setCurrentImages(removeItemFromArray(currentImages, selectedIndex));

                                                                        }}
                                                                        style={{ color: `${selectedIndex < 0 ? 'gray':'red'}` }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="Add Image" placement="top" arrow>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            imageInputRef.current.click();
                                                                        }}
                                                                        style={{ color: 'blue' }}
                                                                    >
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </Tooltip>


                                                            </div>
                                                        </>
                                                        : <div className="no-thumbnail-container" style={{height: '100%'}}>

                                                            <button onClick={() => imageInputRef.current.click()} className="add-images-button">
                                                                <span className="add-thumbnail-prompt">Click to add images</span>
                                                                <CloudUploadIcon className="thumbnail-upload-icon" />
                                                            </button>

                                                        </div>
                                                }

                                            </div>

                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                        </div>

                        <div  className="register-room-button-container">
                            <Tooltip
                                title={submitButtonEnabled ? (isEditingRoom ? 'Edit Room' : 'Create Room') : 'Please fill in all the required fields'}
                                placement="top"
                                arrow
                            >
                                <button
                                    disabled={!submitButtonEnabled}
                                    onClick={() => onSubmit()}
                                    className="register-room-button"
                                >
                                    {loading ? <CircularProgress /> : isEditingRoom ? 'Edit Room' : 'Create Room'}
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