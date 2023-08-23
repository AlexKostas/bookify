import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {DataGrid, GridToolbar, GridToolbarContainer} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import {Button, MenuItem, Select} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import './roomdashboard.css'

const RoomDashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const [rooms, setRooms] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { auth } = useAuth();

    const navigate = useNavigate();

    const clearError = () => setError(null);

    const deleteRoom = async (roomID, roomName) => {
        const endpointURL = 'room/deleteRoom';

        try{
            await axiosPrivate.delete(`${endpointURL}/${roomID}`);
            fetchRooms();

            setSuccess(`Room '${roomName}' deleted successfully`);
            setError(null);
            setTimeout(() => {setSuccess(null)}, 2000);
        }
        catch(error){
            console.log(error);

            if(!error.response){
                setError('No server response. Is the server running?');
            }
            else {
                setError('An error occurred. Please check the console for more details');
            }

            setSuccess(null);
            setTimeout(clearError, 3500);
        }
    }

    const columns = [
        { field: 'name', headerName: 'Room Name', width: 130, align: 'center', headerAlign: 'center', sortable: false, flex: 1, filterable:false },
        { field: 'address', headerName: 'Address', width: 130, align: 'center', headerAlign: 'center', sortable: false, flex: 1, filterable:false },
        {
            field: 'action',
            headerName: 'Action',
            width: 600,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            flex: 1,
            renderCell: (params) => {
                const roomID = params.row.roomID;
                const roomName = params.row.name;

                return (
                    <div>

                        <Tooltip title="View Room" placement="top">
                            <IconButton
                                aria-label="view"
                                onClick={() => navigate(`/room/${roomID}`)}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Room" placement="top">
                            <IconButton
                                aria-label="rdit"
                                onClick={() => navigate(`/create`, {state: roomID })}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Room" placement="top">
                            <IconButton
                                aria-label="delete"
                                onClick={() => deleteRoom(roomID, roomName)}
                                style={{ color: 'red' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            }
        }
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/create')}
                    startIcon={<AddIcon />}
                >
                    Create
                </Button>
            </GridToolbarContainer>
        );
    }

    const fetchRooms = async () => {
        const endpointURL = `room/getRoomsOfHost/${auth.user}`

        try{
            const response = await axiosPrivate.get(`${endpointURL}?pageNumber=${paginationModel.page}&pageSize=${paginationModel.pageSize}`);

            setRooms(response?.data?.content);
            setTotalItems(response.data.totalElements);
            setLoading(false);
        }
        catch(error){
            console.log(error);
            setLoading(false);

            if(!error.response){
                setError('No server response. Is the server running?');
            }
            else {
                setError('An error occured while fetching the rooms. Please check the console for more details');
            }
        }
    }

    useEffect(() => {
        fetchRooms();
    }, [paginationModel.page]);

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        fetchRooms();
    }, [paginationModel.pageSize]);


    return (
        <div>
            {loading ? (
            <div className='loading-container'>
                <CircularProgress size={80} className='circular-progress' />
                <h3>Loading Rooms...</h3>
            </div>
            ) : (
                <>
                    <div className='data-grid' style={{ height: 400 }}>
                    {success ? (
                    <Alert severity="success" onClose={() => { setSuccess(null) }}>
                        <AlertTitle>Success</AlertTitle>
                        {success}
                    </Alert>
                    ) : error && (
                    <Alert severity="error" onClose={clearError}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                    )}

                    <DataGrid
                        rows={rooms}
                        columns={columns}
                        rowCount={totalItems}
                        pageSizeOptions={[3, 5, 10]}
                        disableColumnMenu
                        getRowId={(row) => row.roomID}
                        paginationMode="server"
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        disableRowSelectionOnClick
                        defaultColumn={{ align: 'center' }} 
                        autoWidth
                        showCellVerticalBorder={true}
                        showColumnVerticalBorder={true}

                        className="datagrid"

                        slots = {
                            {toolbar: CustomToolbar}
                        }
                    />
                
                    </div>
                </>
            
            )}
        </div>
    );
}

export default RoomDashboard;