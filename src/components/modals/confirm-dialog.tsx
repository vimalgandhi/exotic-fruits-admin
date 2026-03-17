// Confirmation dialog
const ConfirmDialog = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;
  return <div className='confirm-dialog'>Are you sure? <button onClick={onConfirm}>Yes</button><button onClick={onClose}>No</button></div>;
};
export default ConfirmDialog;