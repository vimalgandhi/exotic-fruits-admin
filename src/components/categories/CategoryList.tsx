import React from 'react';
import { usePagination, useQuery } from 'react-query';
import { fetchCategories } from '../../api';

const CategoryList = () => {
    const { data, error, isLoading } = useQuery('categories', fetchCategories);

    const pagination = usePagination({
        totalItems: data?.length || 0,
        itemsPerPage: 10,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories</div>;

    return (
        <div className="category-list">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <ul className="list-disc pl-5">
                {pagination.items.map((category) => (
                    <li key={category.id} className="py-2">
                        {category.name}
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {/* Pagination controls */}
                <button onClick={pagination.previousPage} disabled={!pagination.hasPrevious} className="mr-2">Previous</button>
                <button onClick={pagination.nextPage} disabled={!pagination.hasNext}>Next</button>
            </div>
        </div>
    );
};

export default CategoryList;