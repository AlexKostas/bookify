import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';


const UserGrid = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});

    const deleteUser = async (username) => {
        console.log(username);
        const endpointURL = 'admin/deleteUser';

        try{
            await axiosPrivate.delete(`${endpointURL}/${username}`);
            fetchUsers();
        }
        catch(error){
            console.log(error);
        }
    }

    const approveHost = async (username) => {
        const endpointURL = 'admin/approveHost';

        try{
            await axiosPrivate.put(`${endpointURL}/${username}`);
            fetchUsers(isChecked);
        }
        catch(error){
            console.log(error);
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