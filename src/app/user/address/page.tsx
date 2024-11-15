"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import useAxiosAuth from "@/utils/axiosClient";

type Address = {
  id: number;
  province: string;
  district: string;
  street: string;
  ward: string;
};

type Province = {
  code: string;
  name: string;
};

type District = {
  code: string;
  name: string;
};

type Ward = {
  code: string;
  name: string;
};

const AddressPage = () => {
  const axiosAuth = useAxiosAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    id: 0,
    province: "",
    district: "",
    street: "",
    ward: "",
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      const response = await axiosAuth.get("/api/User/Address");
      if (response.data.success) {
        setAddresses(response.data.data || []);
      } else {
        setError("Failed to load addresses.");
      }
    } catch (err) {
      setError("An error occurred while fetching addresses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [axiosAuth]);

  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/?depth=1").then((response) => {
      setProvinces(response.data);
    });
  }, []);

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    const provinceCode = e.target.selectedOptions[0].getAttribute("data-code");
    setNewAddress({ ...newAddress, province: provinceName });
    axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).then((response) => {
      setDistricts(response.data.districts);
      setWards([]);
    });
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    const districtCode = e.target.selectedOptions[0].getAttribute("data-code");
    setNewAddress({ ...newAddress, district: districtName });
    axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).then((response) => {
      setWards(response.data.wards);
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewAddress({
      id: 0,
      province: "",
      district: "",
      street: "",
      ward: "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateAddress = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosAuth.post("/api/User/Address", newAddress);
      if (response.data.success) {
        setSuccess("Address added successfully.");
        handleCloseModal();
        fetchAddresses(); // Reload addresses after successful addition
      } else {
        setError("Failed to add address.");
      }
    } catch (err) {
      setError("An error occurred while adding address.");
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const response = await axiosAuth.delete(`/api/User/Address/${id}`);
      if (response.data.success) {
        setSuccess("Address deleted successfully.");
        setAddresses(addresses.filter((address) => address.id !== id));
      } else {
        setError("Failed to delete address.");
      }
    } catch (err) {
      setError("An error occurred while deleting address.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl w-full">
        <h1 className="text-3xl font-semibold text-center mb-8 text-blue-600">Manage Addresses</h1>

        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-6 text-center">
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Add New Address
          </button>
        </div>

        {/* Address List with Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="p-4 bg-gray-100 border rounded-lg shadow-md">
                <p className="font-semibold text-lg text-gray-800">Address ID: {address.id}</p>
                <p className="text-sm text-gray-700">
                  <strong>Province:</strong> {address.province} <br />
                  <strong>District:</strong> {address.district} <br />
                  <strong>Ward:</strong> {address.ward} <br />
                  <strong>Street:</strong> {address.street}
                </p>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="bg-red-600 text-white mt-4 py-2 px-4 rounded-lg hover:bg-red-700 transition w-full"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-md shadow-lg">
              <h2 className="text-2xl font-medium mb-4 text-center text-blue-600">Add Address</h2>

              <form onSubmit={handleCreateAddress} className="flex flex-col gap-4">
                <label className="text-sm font-medium text-gray-700">Province</label>
                <select
                  onChange={handleProvinceChange}
                  required
                  value={newAddress.province}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 transition"
                >
                  <option value="">Select Province</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.name} data-code={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-medium text-gray-700">District</label>
                <select
                  onChange={handleDistrictChange}
                  required
                  value={newAddress.district}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 transition"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.name} data-code={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-medium text-gray-700">Ward</label>
                <select
                  onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                  required
                  value={newAddress.ward}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 transition"
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>

                <label className="text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-600 transition"
                />

                <div className="flex justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Address
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
