import React, { useState } from 'react';
import './CategoryList.css';

const CategoryList = ({ categories }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the total number of pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Get the current categories for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle items per page changes
  const handleItemsPerPageChange = (event) => {
    console.log('Items per page changed to: ', event.target.value);
    // Update the items per page state if necessary
  };

  return (
    <div>
      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category, index) => (
            <tr key={index}>
              <td>{category.name}</td>
              <td>{category.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
        <select onChange={handleItemsPerPageChange}>
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='15'>15</option>
        </select>
        <p>Page {currentPage} of {totalPages}</p>
        <p>Showing {currentItems.length} of {categories.length} categories</p>
      </div>
    </div>
  );
};

export default CategoryList;