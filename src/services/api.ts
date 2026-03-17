// api.ts - Mock API Endpoints

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
}

interface Category {
    id: number;
    name: string;
}

const products: Product[] = [
    { id: 1, name: 'Apple', price: 1.2, description: 'Fresh Apple', categoryId: 1 },
    { id: 2, name: 'Banana', price: 0.5, description: 'Ripe Banana', categoryId: 1 },
];

const categories: Category[] = [
    { id: 1, name: 'Fruits' },
];

// CRUD operations for Products
const getProducts = (page: number, pageSize: number): Product[] => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
};

const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
};

const createProduct = (newProduct: Product): void => {
    products.push(newProduct);
};

const updateProduct = (updatedProduct: Product): void => {
    const index = products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
        products[index] = updatedProduct;
    }
};

const deleteProduct = (id: number): void => {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
        products.splice(index, 1);
    }
};

// CRUD operations for Categories
const getCategories = (): Category[] => {
    return categories;
};

const getCategoryById = (id: number): Category | undefined => {
    return categories.find(category => category.id === id);
};

const createCategory = (newCategory: Category): void => {
    categories.push(newCategory);
};

const updateCategory = (updatedCategory: Category): void => {
    const index = categories.findIndex(category => category.id === updatedCategory.id);
    if (index !== -1) {
        categories[index] = updatedCategory;
    }
};

const deleteCategory = (id: number): void => {
    const index = categories.findIndex(category => category.id === id);
    if (index !== -1) {
        categories.splice(index, 1);
    }
};

// Export the functions
export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
