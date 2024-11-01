import React from 'react';
import "@/app/admin/style/delete.css"; // Nhập CSS mới
interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  productName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, onClose, onDeleteConfirm, productName }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Xóa Sản Phẩm</h3>
        <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{productName}</strong> không?</p>
        <div className="modal-actions">
          <button className="confirm-button" onClick={onDeleteConfirm}>Xác nhận</button>
          <button className="cancel-button" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;