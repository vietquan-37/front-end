import React from 'react';
import "@/app/admin/style/delete.css"; 

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  productName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, onClose, onDeleteConfirm, productName }) => {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h3 className="delete-modal-title">Xóa Sản Phẩm</h3>
        <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{productName}</strong> không?</p>
        <div className="delete-modal-actions">
          <button className="delete-confirm-button" onClick={onDeleteConfirm}>Xác nhận</button>
          <button className="delete-cancel-button" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
