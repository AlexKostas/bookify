import { useState } from "react";
import { Pagination } from "@mui/material";
import './paginationControls.css';

const PaginationControls = ({ children, onPageChanged, totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [orderDirection, setOrderDirection] = useState('ASC');

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        onPageChanged(newPage, orderDirection);
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Use 'auto' for instant scroll
        });
    }

    const handleSortingChange = (value) => {
        setOrderDirection(value);
        setCurrentPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Use 'auto' for instant scroll
        });
    }

    return (
        <div>
            <div className="sort">
                <select value={orderDirection} onChange={(event) => handleSortingChange(event.target.value)}>
                <option value="ASC">Ascending Price</option>
                <option value="DESC">Descending Price</option>
                </select>
            </div>

            <div className="pagination-controls">
                <Pagination 
                    size="large" 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    className="pagination-button"
                    showFirstButton
                    showLastButton
                    variant="outlined" 
                    color="secondary"
                />
            </div>
            
            {children}

            <div className="pagination-controls">
                <Pagination 
                    size="large" 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    className="pagination-button"
                    showFirstButton
                    showLastButton
                    variant="outlined" 
                    color="secondary"
                />
            </div>
        </div>
    );
}

export default PaginationControls;