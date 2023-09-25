import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {DataGrid, GridToolbarContainer} from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

import './usergrid.css';
import {Button, MenuItem, Select} from "@mui/material";

const UserGrid = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileLoading, setFileLoading] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState('JSON');

    const navigate = useNavigate();

    const clearError = () => setError(null);

    const deleteUser = async (username) => {
        const endpointURL = 'admin/deleteUser';

        try{
            await axiosPrivate.delete(`${endpointURL}/${username}`);
            fetchUsers();

            setSuccess(`User ${username} deleted successfully`);
            setError(null);
            setTimeout(() => {setSuccess(null)}, 3000);
        }
        catch(error){
            console.log(error);

            if(!error.response){
                setError('No server response. Is the server running?');
            }
            else {
                setError('An error occured. Please check the console for more details');
            }

            setSuccess(null);
            setTimeout(clearError, 3000);
        }
    }

    const approveHost = async (username) => {
        const endpointURL = 'admin/approveHost';

        try{
            await axiosPrivate.put(`${endpointURL}/${username}`);
            fetchUsers(isChecked);

            setSuccess(`Host ${username} approved successfully`);
            setError(null);
            setTimeout(() => {setSuccess(null)}, 5000);
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
            setTimeout(clearError, 3000);
        }
    }

    const rejectHost = async (username) => {
        const endpointURL = 'admin/rejectHost';

        try{
            await axiosPrivate.put(`${endpointURL}/${username}`);
            fetchUsers(isChecked);

            setSuccess(`Host ${username} rejected successfully`);
            setError(null);
            setTimeout(() => {setSuccess(null)}, 3000);
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
            setTimeout(clearError, 3000);
        }
    }

    const downloadFile = (content, fileType, filename) => {
        if (fileType === 'json')
            content = JSON.stringify(content, null, 2);

        const blob = new Blob([content], {type: `application/${fileType}`})
        const url = URL.createObjectURL(blob);

        // Create a custom link and call it, so we can download the file from the browser
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${fileType}`;
        a.click();

        URL.revokeObjectURL(url);
    }

    const handleExport = async (endpointURL, filename) => {
        try{
            setFileLoading(true);

            const response = await axiosPrivate.get(endpointURL);
            downloadFile(response.data, selectedFileType.toLowerCase(), filename);
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
            setTimeout(clearError, 5000);
        }
        finally {
            setFileLoading(false);
        }
    }

    const columns = [
        { field: 'username', headerName: 'User name', width: 130, align: 'center', headerAlign: 'center', sortable: false, flex: 1, filterable:false },
        { field: 'firstName', headerName: 'First name', width: 130, align: 'center', headerAlign: 'center', sortable: false, flex: 1, filterable:false },
        { field: 'lastName', headerName: 'Last name', width: 130, align: 'center', headerAlign: 'center', sortable: false, flex: 1, filterable:false },
        {
            field: 'rolesText',
            headerName: 'Roles',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            width: 300,
            flex: 1,
        },
    ];

    const actionColumn = [
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
                const username = params.row.username;
                const roles = params.row.roles;

                return (
                    <div>

                        <Tooltip title="View User" placement="top">
                            <IconButton
                                aria-label="view"
                                onClick={() => navigate(`/user/${username}`)}
                            >
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>

                        {roles.includes('inactive-host') && (
                            <>
                                <Tooltip title="Approve Host" placement="top">
                                    <IconButton
                                        aria-label="check"
                                        onClick={() => approveHost(username)}
                                    >
                                        <CheckIcon style={{ color: 'green' }} />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Reject Host" placement="top">
                                    <IconButton
                                        aria-label="reject"
                                        onClick={() => rejectHost(username)}
                                    >
                                        <CancelIcon style={{ color: 'red' }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        <Tooltip title="Delete User" placement="top">
                            <IconButton
                                aria-label="delete"
                                onClick={() => deleteUser(username)}
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
                    onClick={() => handleExport(`admin/getData${selectedFileType}`, 'room_data')}
                    startIcon={<CloudDownloadIcon />}
                    disabled={fileLoading}
                >
                    Export Room Data
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleExport(`admin/getHostRev${selectedFileType}`, 'host_reviews')}
                    startIcon={<CloudDownloadIcon />}
                    disabled={fileLoading}
                >
                    Export Host Reviews
                </Button>

                <Select
                    id="fileType"
                    value={selectedFileType}
                    onChange={(event) => setSelectedFileType(event.target.value)}
                    size="small"
                    sx={{
                        minWidth: 120,
                        // color: 'white',
                        // '& .MuiSelect-icon': {
                        //     color: 'white',
                        // },
                        // backgroundColor: 'primary.main',
                        // '&:hover': {
                        //     backgroundColor: 'primary.dark',
                        // },
                    }}
                >
                    <MenuItem value="JSON">JSON</MenuItem>
                    <MenuItem value="XML">XML</MenuItem>
                </Select>

                {
                    fileLoading && <CircularProgress />
                }
            </GridToolbarContainer>
        );
    }

    const fetchUsers = async (checked) => {
        const endpointURL = checked ? 
                                'admin/getAllInactiveHosts'  
                                : 'admin/getAllUsers';

        try{
            const response = await axiosPrivate.get(`${endpointURL}?pageNumber=${paginationModel.page}&pageSize=${paginationModel.pageSize}`);

            const finalUserObjects = response.data.content.map((user) => ({
                ...user,
                rolesText:  user.roles.join(', '),
            }));

            setUsers(finalUserObjects);
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
                setError('An error occured while fetching the users. Please check the console for more details');
            }
        }
    }

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        fetchUsers(event.target.checked);
    };

    useEffect(() => {
        fetchUsers();
    }, [paginationModel.page]);

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        fetchUsers();
    }, [paginationModel.pageSize]);

    return (
        <div>
            {loading ? (
            <div className='loading-container'>
                <CircularProgress size={80} className='circular-progress' />
                <h3>Loading users...</h3>
            </div>
            ) : (
                <>
                    <div className='data-grid-container' style={{ height: 400 }}>
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
                        <div className='data-grid' style={{ height: 400 }}>
                            <DataGrid
                                rows={users}
                                columns={columns.concat(actionColumn)}
                                rowCount={totalItems}
                                pageSizeOptions={[5, 10, 20]}
                                disableColumnMenu
                                getRowId={(row) => row.id}
                                paginationMode="server"
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                disableRowSelectionOnClick
                                defaultColumn={{ align: 'center' }}
                                autoWidth
                                showCellVerticalBorder={true}
                                showColumnVerticalBorder={true}

                                slots = {
                                    {toolbar: CustomToolbar}
                                }
                            />

                        </div>
                    </div>
                    <div className='checkbox-container'>
                        <FormControlLabel
                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                            label="Show only users pending host approval"
                            labelPlacement='start'
                            className='checkbox'
                        />
                    </div>
                </>
            
            )}
        </div>
    );

}

export default UserGrid;