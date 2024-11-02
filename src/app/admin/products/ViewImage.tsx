import React, { useState } from 'react';
import "@/app/admin/style/viewimage.css";

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  images: string[];
  koiId: number | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, onClose, images, koiId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!koiId || !selectedFile) return alert("Chưa chọn file hoặc không có Koi.");
    const formData = new FormData();
    formData.append("files", selectedFile);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/KOIImage/${koiId}/images`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        alert("Ảnh đã được upload thành công!");

        // Bạn có thể cập nhật danh sách ảnh sau khi upload thành công nếu muốn:
        // Thêm URL ảnh vừa upload vào danh sách hiện tại
        const newImageUrl = result.data; // Giả định API trả về URL ảnh
        onClose(); // Đóng modal sau khi upload
      } else {
        alert("Lỗi khi upload ảnh!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Lỗi khi upload ảnh!");
    }
  };

  const handleImageClick = (index: number) => {
    if (images[index]) {
      setSelectedImageId(index);
    } else {
      alert("Không có ảnh để cập nhật.");
    }
  };

  const handleCancelUpdate = () => {
    setSelectedImageId(null);
    setSelectedFile(null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="modal-view">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Hình ảnh sản phẩm</h2>
        <div className="modal-body">
          <button className="modal-exit" onClick={onClose}>Exit</button>
          <div className="modal-image-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="modal-image-item" onClick={() => handleImageClick(index)}>
                {images[index] ? (
                  <img src={images[index]} alt={`Hình ảnh ${index + 1}`} />
                ) : (
                  <div className="flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
            ))}
          </div>
          <input type="file" id="fileInput" onChange={handleFileChange} className="modal-file-input mt-4" />
          {selectedImageId !== null ? (
            <>
              <button onClick={handleUploadImage} className="modal-upload-button mt-2">
                Cập nhật ảnh
              </button>
              <button onClick={handleCancelUpdate} className="modal-cancel-button mt-2">
                Hủy
              </button>
            </>
          ) : (
            <button onClick={handleUploadImage} className="modal-upload-button mt-2">
              Thêm ảnh
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
