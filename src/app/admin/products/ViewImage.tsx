import React from 'react';

interface ImageModalProps {
  show: boolean;
  onClose: () => void;
  images: string[];
}

const ImageModal: React.FC<ImageModalProps> = ({ show, onClose, images }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded shadow-lg p-4 w-80 h-80 flex flex-col">
        <h2 className="text-lg text-center mb-2">Hình ảnh sản phẩm</h2>
        <button className="self-end mb-2" onClick={onClose}>X</button>
        <div className="grid grid-cols-2 gap-2 h-full">
          {/* Hiển thị tối đa 4 ảnh, nếu không sẽ để trống */}
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex justify-center items-center border-2 border-gray-300">
              {images[index] ? (
                <img src={images[index]} alt={`Hình ảnh ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;