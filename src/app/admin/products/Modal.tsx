// Modal.tsx
import React, { useState } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (newProductId: number) => void; // Cập nhật để nhận ID sản phẩm mới
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
    price: 0,
    quantity: 0,
    size: 0,
    dob: new Date().toISOString().split('T')[0], // Ngày sinh mặc định là hôm nay
    categoryid: 1,
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/koi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error("Failed to create product");

      const data = await response.json();
      onSubmit(data.id); // Gọi onSubmit với ID của sản phẩm mới tạo
      onClose(); // Đóng modal sau khi gửi
    } catch (error) {
      console.error("Error adding new product:", error);
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
            onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: +e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="number"
            placeholder="Size"
            value={newProduct.size}
            onChange={(e) => setNewProduct({ ...newProduct, size: +e.target.value })}
            className="border p-2 w-full mb-2"
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