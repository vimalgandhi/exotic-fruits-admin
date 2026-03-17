// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className='modal'>
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  );
};
export default Modal;