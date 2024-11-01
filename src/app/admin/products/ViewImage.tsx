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
    if (!koiId) return alert("Không có KoiId.");
    if (selectedImageId !== null && !selectedFile) {
      return alert("Chưa chọn file mới để cập nhật ảnh.");
    }
    if (selectedImageId === null && !selectedFile) {
      return alert("Chưa chọn file để upload.");
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append("files", selectedFile);
    }

    try {
      let response;

      if (selectedImageId === null) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/KOIImage/${koiId}/images`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/KOIImage/${koiId}/images/${selectedImageId}`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert("Lỗi khi upload ảnh: " + (errorData.message || "Không rõ lỗi!"));
        return;
      }

      alert(selectedImageId === null ? "Ảnh đã được thêm thành công!" : "Ảnh đã được cập nhật thành công!");
      onClose(); // Close modal after successful upload
    } catch (error) {
      alert("Có lỗi xảy ra trong quá trình upload.");
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="modal-header">Quản lý hình ảnh</h2>
        <div className="image-grid">
          {images.map((image, index) => (
            <div key={index} className="image-item" onClick={() => handleImageClick(index)}>
              {image ? (
                <img 
                  src={image} 
                  alt={`Hình ảnh ${index + 1}`}  
                  onError={() => console.error(`Failed to load image at ${image}`)} 
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
          ))}
        </div>
        <input type="file" onChange={handleFileChange} className="mt-4" />
        <div className="button-group">
          {selectedImageId !== null ? (
            <>
              <button onClick={handleUploadImage} className="upload-button">Cập nhật ảnh</button>
              <button onClick={handleCancelUpdate} className="cancel-button">Hủy</button>
            </>
          ) : (
            <button onClick={handleUploadImage} className="upload-button">Thêm ảnh</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;