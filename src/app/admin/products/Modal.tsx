// Modal.tsx
import React, { useState } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (newProductId: any) => void; // Cập nhật để nhận ID sản phẩm mới
}
// Hard-code danh sách tên danh mục dựa trên ID
const categoryNames: { [key: number]: string } = {
    1: "Asagi",
    2: "Goshiki",
    3: "Kohaku",
    4: "Shusui",
    5: "Koromo",
    6: "Bekko",
    7: "Doitsu",
    8: "Tancho",
    9: "Ginrin",
    10: "Showa",
  };
  
const Modal: React.FC<ModalProps> = ({ show, onClose, onSubmit }) => {
  const [newProduct, setNewProduct] = useState({
    namekoi: '',
    descriptionkoi: '',
    price: '',
    quantity: '',
    size: '',
    dob: new Date().toISOString().split('T')[0], // Ngày sinh mặc định là hôm nay
    categoryid: 1,
  });

  const [errorMessage, setErrorMessage] = useState(''); // State để quản lý thông báo lỗi

  const handleSubmit = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/koi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newProduct),
    });
    const text = await response.text(); // Get response as text first
    console.log('Response Text:', text); // In ra phản hồi từ server
    const responseData = text ? JSON.parse(text) : {}; // Parse only if text exists
    console.log('HTTP Status:', response.status); // Ghi lại mã trạng thái
    console.log('Response Data:', responseData); // Ghi lại nội dung phản hồi
 // Kiểm tra mã trạng thái phản hồi
 if (!response.ok) {
  alert(responseData.message || "An error occurred while creating the product.");
      return; // Thoát ra nếu có lỗi
  }
  // Handle the parsed response
  if (responseData.success) {
    alert(responseData.message); // Hiển thị thông báo thành công
      onSubmit(responseData.data); // Gọi onSubmit với ID sản phẩm mới
      setErrorMessage(''); // Xóa bất kỳ thông báo lỗi nào
  } else {
    alert(responseData.message || "An unknown error occurred."); // Hiển thị thông báo lỗi
    }
    onClose(); // Close modal after submission
  }  
  catch (error) {
    console.error("Error adding new product:", error);

    // Kiểm tra kiểu lỗi
    if (error instanceof Error) {
      setErrorMessage(error.message); // Nếu là Error, lấy thông điệp
    } else {
      setErrorMessage("An unknown error occurred"); // Nếu không phải Error, thông báo lỗi chung
    }
  }
};
  return (
    show ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-lg mb-2">Create New Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.namekoi}
            onChange={(e) => setNewProduct({ ...newProduct, namekoi: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.descriptionkoi}
            onChange={(e) => setNewProduct({ ...newProduct, descriptionkoi: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}            
            onChange={(e) => {
              const value = e.target.value === '' ? '' : e.target.value; // Nếu rỗng, xử lý là chuỗi rỗng
              setNewProduct({ ...newProduct, price: value });
            }}            
            className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : e.target.value; // Nếu rỗng, xử lý là chuỗi rỗng
              setNewProduct({ ...newProduct, quantity: value });
            }}              className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Size"
            value={newProduct.size}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : e.target.value; // Nếu rỗng, xử lý là chuỗi rỗng
              setNewProduct({ ...newProduct, size: value });
            }}              className="border p-2 w-full mb-2"
          />
          <input
            type="date"
            value={newProduct.dob}
            onChange={(e) => setNewProduct({ ...newProduct, dob: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <select
            value={newProduct.categoryid}
            onChange={(e) => setNewProduct({ ...newProduct, categoryid: +e.target.value })}
            className="border p-2 w-full mb-2"
          >
            {Object.entries(categoryNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <div className="flex justify-between">
            <button onClick={onClose} className="bg-gray-300 p-2 rounded">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Submit</button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default Modal;