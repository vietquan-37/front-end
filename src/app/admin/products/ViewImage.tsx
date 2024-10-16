import React, { useState } from 'react';
import "@/app/admin/style/viewimage.css";

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  images: string[];
  koiId:number | null;
}
const ImageModal: React.FC<ImageModalProps> = ({ show, onClose, images,koiId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // Hàm xử lý khi chọn file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
      }
    };
     // Hàm upload ảnh
  const handleUploadImage = async () => {
    if (!koiId || !selectedFile) return alert("Chưa chọn file hoặc không có KoiId.");

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

  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
    <div className="modal-container">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2 className="modal-header">Hình ảnh sản phẩm</h2>
      <div className="modal-content">
      <button className="self-end mb-2" onClick={onClose}>Exit</button>
        <div className="image-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="image-item">
              {images[index] ? (
                <img src={images[index]} alt={`Hình ảnh ${index + 1}`} />
              ) : (
                <div className="flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
          ))}
        </div>
        <input type="file" onChange={handleFileChange} className="mt-4" />
        <button onClick={handleUploadImage} className="upload-button mt-2">
          Upload Image
        </button>
      </div>
      
    </div>
  </div>
  );
};
export default ImageModal;