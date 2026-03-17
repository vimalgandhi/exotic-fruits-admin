import React, { useState } from 'react';

const CategoryList = ({ categories }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const styles = {
        container: { padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' },
        header: { marginBottom: '20px' },
        title: { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' },
        subtitle: { fontSize: '14px', color: '#6b7280', margin: 0 },
        table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' },
        thead: { backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' },
        th: { padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', fontSize: '14px' },
        td: { padding: '12px 16px', color: '#6b7280', fontSize: '14px' },
        paginationControls: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' },
        button: { padding: '8px 12px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' },
        buttonActive: { backgroundColor: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
        buttonDisabled: { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#f3f4f6' },
        select: { padding: '8px 12px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 },
        p: { margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: 500 }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Categories</h1>
                <p style={styles.subtitle}>{categories.length} categories total</p>
            </div>
            <table style={styles.table}>
                <thead style={styles.thead}>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Products</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((category) => (
                        <tr key={category.id} style={styles.tr} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}> 
                            <td style={styles.td}>{category.name}</td>
                            <td style={styles.td}>{category.description}</td>
                            <td style={styles.td}>{category.productCount}</td>
                            <td style={styles.td}> 
                                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500, backgroundColor: category.status === 'active' ? '#dcfce7' : '#f3f4f6', color: category.status === 'active' ? '#166534' : '#6b7280' }}> 
                                    {category.status === 'active' ? '✓ Active' : 'Inactive'} 
                                </span> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={styles.paginationControls}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Items per page:</label>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} style={styles.select}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <p style={styles.p}> Page <strong style={{ color: '#3b82f6' }}>{currentPage}</strong> of <strong style={{ color: '#3b82f6' }}>{totalPages}</strong> | Showing <strong style={{ color: '#3b82f6' }}>{currentItems.length}</strong> of <strong style={{ color: '#3b82f6' }}>{categories.length}</strong> categories </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{ ...styles.button, ...(currentPage === 1 ? styles.buttonDisabled : {}) }} title="Previous Page"> ← Previous </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => paginate(page)} style={{ ...styles.button, ...(currentPage === page ? styles.buttonActive : {}), minWidth: '32px', height: '32px', padding: '4px' }}> {page} </button>
                        ))}
                    </div>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} style={{ ...styles.button, ...(currentPage === totalPages ? styles.buttonDisabled : {}) }} title="Next Page"> Next → </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;