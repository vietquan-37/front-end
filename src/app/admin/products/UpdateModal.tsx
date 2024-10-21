// src/app/admin/products/UpdateModal.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from 'notistack'; // import useSnackbar

interface Product {
    id: number;
    size: number;
    dob: Date;
    descriptionkoi: string;
    price: number;
    namekoi: string;
    quantity: number;
    categoryid: number;  
}

interface UpdateModalProps {
    show: boolean;
    onClose: () => void;
    productId: number | null;
    productData: Product | null;
}

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

const UpdateModal: React.FC<UpdateModalProps> = ({ show, onClose, productId, productData }) => {
    const [currentData, setCurrentData] = useState<Product | null>(productData);
    const [updating, setUpdating] = useState(false);
    const { enqueueSnackbar } = useSnackbar(); // Khai báo enqueueSnackbar

    // Cập nhật currentData khi productData thay đổi
    useEffect(() => {
        if (productData) {
            setCurrentData({
                id: productData.id,
                namekoi: productData.namekoi, // Giữ tên sản phẩm
                descriptionkoi: productData.descriptionkoi, // Giữ mô tả
                dob: new Date(productData.dob), // Chuyển đổi sang date nếu cần
                price: productData.price,
                quantity: productData.quantity,
                categoryid: productData.categoryid,
                size: productData.size,
            });
        }
    }, [productData]);

    const handleUpdate = async () => {
        if (currentData) {
            // Đảm bảo rằng tất cả các trường bắt buộc đều tồn tại
            if (!currentData.namekoi || !currentData.descriptionkoi) {
                console.error("Các trường bắt buộc bị thiếu:", {
                    name: currentData.namekoi,
                    description: currentData.descriptionkoi,
                });
                return; // Ngừng hàm nếu thiếu trường bắt buộc
            }
    
            setUpdating(true); // Đặt trạng thái updating
            console.log("Dữ liệu sản phẩm đang cập nhật:", currentData);
            try {
                const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API}/api/koi/${currentData.id}`,
                    {
                        id: currentData.id,
                        size: currentData.size,
                        dob: currentData.dob.toISOString().split('T')[0], // Chuyển đổi thành chuỗi ngày
                        descriptionkoi: currentData.descriptionkoi, // Đổi tên ở đây
                        price: currentData.price,
                        namekoi: currentData.namekoi, // Đổi tên ở đây
                        quantity: currentData.quantity,
                        categoryid: currentData.categoryid,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
    
                // Kiểm tra phản hồi từ API
                if (response.data.success) {
                    console.log("Cập nhật sản phẩm thành công:", response.data.data);
                    onClose(); // Đóng modal sau khi cập nhật
                    enqueueSnackbar("Cập nhật sản phẩm thành công!", { variant: "success" });
                } else {
                    console.error('Cập nhật sản phẩm thất bại:', response.data);
                    // Nếu API có trường "error" hoặc thông báo lỗi đang liên quan đến trường, xử lý trường hợp này
                    if (response.data.error) {
                        enqueueSnackbar(response.data.error, { variant: "error" });
                    } else if (response.data['error-messages']) {
                        const errorMessages = response.data['error-messages'];
                        for (const key in errorMessages) {
                            if (errorMessages.hasOwnProperty(key)) {
                                const messages = errorMessages[key];
                                messages.forEach((msg: string) => {
                                    enqueueSnackbar(`${key}: ${msg}`, { variant: "error" });
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating product:', error);
                enqueueSnackbar("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm", { variant: "error" });
            } finally {
                setUpdating(false); // Đặt trạng thái updating thành false
            }
        }
    };

    if (!show) return null; 
    if (!currentData) return <div>Không có dữ liệu sản phẩm.</div>; 
 // Hàm để định dạng giá VND với dấu phẩy
 const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
};
    


    // Hàm để chuyển đổi Date thành chuỗi yyyy-mm-dd
    const formatDate = (date: Date): string => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return ""; // Trả về chuỗi rỗng nếu date không hợp lệ
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 vì tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="modal-container bg-white rounded shadow-lg p-6 max-w-4xl overflow-auto">
                <button className="close-button text-red-500" onClick={onClose}>
                    &times;
                </button>
                <h1 className="text-xl font-bold text-center mb-4">Cập nhật sản phẩm: {currentData.namekoi}</h1>
                <form>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
    <label className="block font-semibold">Tên sản phẩm:</label>
    <input
        type="text"
        className="border border-gray-300 rounded p-2 w-full"
        value={currentData.namekoi} 
        onChange={(e) => setCurrentData((prev) => ({ ...prev!, namekoi: e.target.value }))}
    />
</div>
                        <div>
                            <label className="block font-semibold">Đặc điểm:</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={currentData.descriptionkoi || ""}
                                onChange={(e) =>
                                    setCurrentData((prev) => ({
                                        ...prev!,
                                        descriptionkoi: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Giá:</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={formatPrice(currentData.price)} // Hiển thị giá theo định dạng VND
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
                                    const numericValue = parseInt(rawValue, 10) || 0; // Chuyển đổi thành số nguyên
                                    setCurrentData((prev) => ({
                                        ...prev!,
                                        price: numericValue, // Cập nhật trường price
                                    }));
                                }}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Số lượng:</label>
                            <input
                                type="number"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={currentData.quantity}
                                onChange={(e) =>
                                    setCurrentData((prev) => ({
                                        ...prev!,
                                        quantity: +e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Kích thước:</label>
                            <input
                                type="number"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={currentData.size}
                                onChange={(e) =>
                                    setCurrentData((prev) => ({
                                        ...prev!,
                                        size: +e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Ngày sinh:</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={formatDate(currentData.dob)} // Chuyển đổi Date thành chuỗi yyyy-mm-dd
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value); // Chuyển đổi chuỗi thành Date
                                    setCurrentData((prev) => ({
                                        ...prev!,
                                        dob: selectedDate, // Cập nhật trường dob
                                    }));
                                }}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Danh mục:</label>
                            <select
                                className="border border-gray-300 rounded p-2 w-full"
                                value={currentData.categoryid}
                                onChange={(e) =>
                                    setCurrentData((prev) => ({
                                        ...prev!,
                                        categoryid: +e.target.value,
                                    }))
                                }
                            >
                                {Object.entries(categoryNames).map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button type="button" className="bg-gray-400 text-white rounded p-2" onClick={onClose}>Hủy</button>
                        <button type="button" className="bg-blue-500 text-white rounded p-2" onClick={handleUpdate}>Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateModal;
