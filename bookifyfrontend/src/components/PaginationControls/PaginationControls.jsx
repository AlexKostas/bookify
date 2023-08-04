import { useEffect, useState } from "react";

const PaginationControls = ({ children, onPageChanged, totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [orderDirection, setOrderDirection] = useState('ASC');

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        onPageChanged(pageNumber, orderDirection);
    }

    const handleSortingChange = (value) => {
        setOrderDirection(value);
        setCurrentPage(1);
    }

    const paginationRange = () => {
        const buttonsToShow = 10;
        const startPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
        const endPage = Math.min(totalPages, startPage + buttonsToShow - 1);

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    useEffect(() => {
        onPageChanged(currentPage, orderDirection);
    }, []);

    return (
        <div>
            <div className="sort">
                <select value={orderDirection} onChange={(event) => handleSortingChange(event.target.value)}>
                <option value="ASC">Ascending Price</option>
                <option value="DESC">Descending Price</option>
                </select>
            </div>
            
            {children}

            <div className="pagination">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                First
                </button>

                {currentPage !== 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                )}

                {paginationRange().map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
                ))}
                {currentPage !== totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                )}

                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                Last
                </button>
            </div>
        </div>
    );
}

export default PaginationControls;