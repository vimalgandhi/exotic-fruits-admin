// Category CRUD modal
const CategoryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return <div className='category-modal'>Category Modal <button onClick={onClose}>Close</button></div>;
};
export default CategoryModal;