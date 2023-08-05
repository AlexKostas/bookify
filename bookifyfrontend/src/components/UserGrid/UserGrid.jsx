import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const UserGrid = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    const deleteUser = async (username) => {
        console.log(username);
        const endpointURL = 'admin/deleteUser';

        try{
            await axiosPrivate.delete(`${endpointURL}/${username}`);
            fetchUsers();

            setSuccess(`User ${username} deleted successfully`);
            setError(null);
            setTimeout(() => {setSuccess(null)}, 5000);
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
            setTimeout(clearError, 5000);
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
                setError('An error occured. Please check the console for more details');
            }

            setSuccess(null);
            setTimeout(clearError, 5000);
        }
    }

    const columns = [
        { field: 'username', headerName: 'User name', width: 130, sortable: false, filterable:false },
        { field: 'firstName', headerName: 'First name', width: 130, sortable: false, filterable:false },
        { field: 'lastName', headerName: 'Last name', width: 130, sortable: false, filterable:false },
        {
            field: 'rolesText',
            headerName: 'Roles',
            sortable: false,
            filterable: false,
            width: 300,
        },
    ];

    const actionColumn = [
        {
            field: 'action',
            headerName: 'Action',
            width: 600,
            renderCell: (params) => {
                const username = params.row.username;
                const roles = params.row.roles;

                return (
                    <div>
                        <Link to={`/user/${username}`} style={{ textDecoration: 'none' }}>
                            <button>View</button>
                        </Link>
                        {roles.includes('inactive-host') && 
                            <button onClick={() => approveHost(username)}>Approve Host</button> 
                        }
                        <button onClick={() => deleteUser(username)}>Delete</button>
                    </div>
                );
            }
        }
    ];

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
        }
        catch(error){
            console.log(error);

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
        <div style={{ height: 400, width: '80%' }}>
            {
                success ? (
                    <Alert severity="success" onClose={() => {setSuccess(null)}}>
                        <AlertTitle>Success</AlertTitle>
                        {success}
                    </Alert>
                ) : error && (
                        <Alert severity="error" onClose={() => {clearError()}}>
                            <AlertTitle>Error</AlertTitle>
                            {error}
                        </Alert>
                    )
            }
            
            <DataGrid
                rows={users}
                columns={columns.concat(actionColumn)}
                rowCount={totalItems}
                pageSizeOptions={[5, 10, 20]}
                disableColumnMenu
                getRowId = {(row) =>  row.id}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
            />
            <FormControlLabel
                control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                label="Show only users pending host approval" // Replace with your desired label
                labelPlacement='start'
            />
                    
        </div>
    );
}

export default UserGrid;