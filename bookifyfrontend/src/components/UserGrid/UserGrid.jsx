import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";

const columns = [
  { field: 'username', headerName: 'User name', width: 130, filterable:false },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'email',
    headerName: 'Roles',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
  },
];

const UserGrid = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10});

    const fetchRooms = async () => {
        const endpointURL = 'admin/getAllUsers';

        try{
            const response = await axiosPrivate.get(`${endpointURL}?pageNumber=${paginationModel.page}&pageSize=${paginationModel.pageSize}`);

            setUsers(response.data.content);
            setTotalItems(response.data.totalElements);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(paginationModel);
        fetchRooms();
    }, [paginationModel.page]);

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        fetchRooms();
    }, [paginationModel.pageSize]);

    return (
        <div style={{ height: 400, width: '80%' }}>
            <DataGrid
                rows={users}
                columns={columns}
                rowCount={totalItems}
                pageSizeOptions={[5, 10, 20]}
                disableColumnMenu
                getRowId = {(row) =>  row.id}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
            />
        </div>
    );
}

export default UserGrid;