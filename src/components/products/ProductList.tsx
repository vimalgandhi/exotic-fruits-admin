import React, { useState } from 'react';

const ProductList = ({ products }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on items per page change
    };

    return (
        <div>
            <h2>Product List</h2>
            <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            <ul>
                {currentItems.map((product, index) => (
                    <li key={index}>{product.name}</li>
                ))}
            </ul>
            <div>
                <button onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default ProductList;