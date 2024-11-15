"use client";

import { useState, useEffect } from "react";
import useAxiosAuth from "@/utils/axiosClient";

type UserProfile = {
  "full-name": string;
  email: string;
  "telephone-number": string;
};

const ProfilePage = () => {
  const axiosAuth = useAxiosAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosAuth.get("/api/User/Profile");
        if (response.data.success) {
          const { "full-name": fullName, email, "telephone-number": telephoneNumber } = response.data.data;
          setProfile({
            "full-name": fullName || "",
            email: email || "",
            "telephone-number": telephoneNumber || "",
          });
        } else {
          setError("Failed to load profile data.");
        }
      } catch (err) {
        setError("An error occurred while fetching profile data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axiosAuth]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!profile) {
      setError("Profile data is missing.");
      return;
    }

    try {
      const response = await axiosAuth.put("/api/User/Profile", {
        "full-name": profile["full-name"],
        email: profile.email,
        "telephone-number": profile["telephone-number"],
      });

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
      } else {
        setError(response.data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while updating profile.");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center mb-8">Profile</h1>
        
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="full-name"
              value={profile?.["full-name"] || ""}
              onChange={(e) => setProfile({ ...profile!, "full-name": e.target.value })}
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile?.email || ""}
              onChange={(e) => setProfile({ ...profile!, email: e.target.value })}
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
             readOnly
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="telephone-number"
              value={profile?.["telephone-number"] || ""}
              onChange={(e) => setProfile({ ...profile!, "telephone-number": e.target.value })}
              className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
