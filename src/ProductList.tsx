import React, { useState } from 'react';

const ProductList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock data for 20 products
    const products = [
        { id: 1, name: 'Apple', stock: 60, category: 'Fruits', price: 1.2 },
        { id: 2, name: 'Banana', stock: 30, category: 'Fruits', price: 0.5 },
        { id: 3, name: 'Cherry', stock: 15, category: 'Fruits', price: 2.5 },
        { id: 4, name: 'Date', stock: 50, category: 'Fruits', price: 3.0 },
        { id: 5, name: 'Elderberry', stock: 5, category: 'Fruits', price: 4.0 },
        { id: 6, name: 'Fig', stock: 42, category: 'Fruits', price: 1.5 },
        { id: 7, name: 'Grape', stock: 80, category: 'Fruits', price: 2.0 },
        { id: 8, name: 'Honeydew', stock: 25, category: 'Fruits', price: 1.8 },
        { id: 9, name: 'Kiwi', stock: 10, category: 'Fruits', price: 3.5 },
        { id: 10, name: 'Lemon', stock: 70, category: 'Fruits', price: 0.8 },
        { id: 11, name: 'Mango', stock: 20, category: 'Fruits', price: 1.0 },
        { id: 12, name: 'Nectarine', stock: 12, category: 'Fruits', price: 2.8 },
        { id: 13, name: 'Orange', stock: 75, category: 'Fruits', price: 0.9 },
        { id: 14, name: 'Papaya', stock: 20, category: 'Fruits', price: 1.7 },
        { id: 15, name: 'Quince', stock: 8, category: 'Fruits', price: 4.5 },
        { id: 16, name: 'Raspberry', stock: 45, category: 'Fruits', price: 2.2 },
        { id: 17, name: 'Strawberry', stock: 34, category: 'Fruits', price: 1.6 },
        { id: 18, name: 'Tangerine', stock: 22, category: 'Fruits', price: 1.4 },
        { id: 19, name: 'Ugli fruit', stock: 18, category: 'Fruits', price: 3.0 },
        { id: 20, name: 'Vitamin C Fruit', stock: 30, category: 'Fruits', price: 2.9 }
    ];

    // Determine the styles based on stock quantities
    const getStockColor = (stock) => {
        if (stock > 50) return 'text-green-500';
        if (stock >= 20 && stock <= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <div className="mb-4">
                <label className="mr-2">Items per page:</label>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} className="border rounded">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Stock</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-100">
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className={`border px-4 py-2 ${getStockColor(product.stock)}`}>{product.stock}</td>
                            <td className="border px-4 py-2 bg-blue-200">{product.category}</td>
                            <td className="border px-4 py-2 text-green-500">${product.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-300 px-4 py-2 rounded" >Previous</button>
                <div>
                    {[...Array(totalPages)].map((_, index) => (
                        <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-4 py-2 rounded`}>{index + 1}</button>
                    ))}
                </div>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="bg-gray-300 px-4 py-2 rounded">Next</button>
            </div>
        </div>
    );
};

export default ProductList;