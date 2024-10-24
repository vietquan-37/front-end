import React, { useState } from 'react';
import "@/app/admin/style/viewimage.css";

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  images: string[];
  koiId:number | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, onClose, images,koiId, }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

    // Hàm xử lý khi chọn file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]);
      }
    };

    const handleUploadImage = async () => {
      if (!koiId) return alert("Không có KoiId."); // Kiểm tra KoiId
  
      // Kiểm tra các điều kiện
      if (selectedImageId !== null && !selectedFile) {
        console.log("Chưa chọn file mới để cập nhật ảnh." + selectedFile, selectedImageId); // Log thông báo nếu có ảnh nhưng chưa chọn file mới
          return alert("Chưa chọn file mới để cập nhật ảnh."); // Nếu có ảnh nhưng chưa chọn file mới
      }
  
      if (selectedImageId === null && !selectedFile) {
        console.log("Chưa chọn file để upload."+ selectedFile, selectedImageId); // Log thông báo nếu không có ảnh và không có file
          return alert("Chưa chọn file để upload."); // Nếu không có ảnh và không có file
      }
  
      // Khởi tạo FormData
      const formData = new FormData();
  
      // Chỉ thêm file vào formData nếu đã chọn file
      if (selectedFile) {
          formData.append("files", selectedFile); // Thêm file vào FormData
      }
    try {
      let response;
     
    if (selectedImageId === null) {
      // Kịch bản 1: Nếu chưa chọn ảnh nào, thêm mới ảnh
      response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/KOIImage/${koiId}/images`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
    } else {
      // Kịch bản 2: Nếu đã chọn ảnh, cập nhật ảnh đã chọn
      response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/KOIImage/${koiId}/images/${selectedImageId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
    }
       // Kiểm tra phản hồi
  if (!response.ok) {
    const errorData = await response.json(); // Chắc chắn server trả về lỗi dạng JSON
    console.error("Error details:", errorData); // Log chi tiết lỗi từ server
    alert("Lỗi khi upload ảnh: " + (errorData.message || "Không rõ lỗi!"));
    return; // Thoát hàm nếu có lỗi
  }

  const result = await response.json();
  alert(selectedImageId === null ? "Ảnh đã được thêm thành công!" : "Ảnh đã được cập nhật thành công!");
  onClose(); // Đóng modal sau khi upload thành công
} catch (error) {
  console.error("Upload error:", error);
  alert("Có lỗi xảy ra trong quá trình upload.");
}
  };

  const handleImageClick = (index: number) => {
    if (images[index]) {
      setSelectedImageId(index); // Ghi nhận chỉ số của ảnh đã chọn
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
    <div className="modal-container">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2 className="modal-header">Hình ảnh sản phẩm</h2>
      <div className="modal-content">
      <button className="self-end mb-2" onClick={onClose}>Exit</button>
        <div className="image-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="image-item" onClick={() => handleImageClick(index)}>
              {images[index] ? (
                <img src={images[index]} alt={`Hình ảnh ${index + 1}`} />
              ) : (
                <div className="flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
          ))}
        </div>
        <input type="file" id="fileInput" onChange={handleFileChange} className="mt-4" />
          {selectedImageId !== null ? (
            <>
              <button onClick={handleUploadImage} className="upload-button mt-2">
                Cập nhật ảnh
              </button>
              <button onClick={handleCancelUpdate} className="cancel-button mt-2">
                Hủy
              </button>
            </>
          ) : (
            <button onClick={handleUploadImage} className="upload-button mt-2">
              Thêm ảnh
            </button>
          )}
      </div>
      
    </div>
  </div>
  );
};
export default ImageModal;