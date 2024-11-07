import React, { useEffect, useState } from 'react';
import "@/app/admin/style/viewimage.css";

interface Image {
  id: number;
  imageUrl: string; 
  koiId: number;
}

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  images: Image[];
  koiId: number | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, onClose, images ,koiId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageList, setImageList] = useState<Image[]>(images);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null); // State lưu ID hình ảnh đã chọn

  const handleImageClick = (image: Image) => {
    console.log("Image clicked:", image.id);
    setSelectedImage(image); // Lưu đối tượng Image vào state
  };

  useEffect(() => {
    if (images) {
      setImageList(images);
    }
  }, [images]);

  const handleDeleteImage = async () => {
    if (selectedImage?.id === null) return; // Không có ID nào được chọn
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/KOIImage/${selectedImage?.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status == 200) {
        alert("Hình ảnh đã được xóa thành công!");
        // Cập nhật lại danh sách hình ảnh sau khi xóa
        setImageList((prevImages) => prevImages.filter(image => image.id !== selectedImage?.id));
        setSelectedImage(null); 
      } else {
        alert("Lỗi khi xóa hình ảnh!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Lỗi khi xóa hình ảnh!");
    }
  };
  
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
        const newImageUrl = result.data; 
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
      <div className="modal-view">
        <button className="modal-close" onClick={onClose}>
        <button className="modal-exit" onClick={onClose}>Exit</button>
        </button>
        <h2 className="modal-title">Hình ảnh sản phẩm</h2>
        <div className="modal-body">
          
          <div className="modal-image-grid">
          {images.length > 0 ? (
  images.map((image) => {
    // console.log("Fetched image object:", image); // Log toàn bộ đối tượng
    // console.log("Fetched image id:", image.id); 
    // console.log("Fetched image URL:", image.imageUrl); // Kiểm tra giá trị URL
    return (
      <div key={image.id} className="modal-image-item">
        <img src={image.imageUrl} alt="Hình ảnh sản phẩm" style={{ maxWidth: '100%', height: '100%' }}
        onClick={() => handleImageClick(image)} />
      
      </div>
    );
  })
) : (
  <div className="flex items-center justify-center text-gray-400">No Image</div>
)}
</div>

          {!selectedImage?.id && (
            <>
              <input type="file" id="fileInput" onChange={handleFileChange} className="modal-file-input mt-4" />
              <button onClick={handleUploadImage} className="modal-upload-button mt-2">
                Thêm ảnh
              </button>
            </>
          )}
          
          {selectedImage?.id && (
            <div className="delete-confirmation">
              <p>U want delete it ?</p>
              <button onClick={handleDeleteImage} className="delete-button">Delete</button>
              <button onClick={() => setSelectedImage(null)} className="cancel-button">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
