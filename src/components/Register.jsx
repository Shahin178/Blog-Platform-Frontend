import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api.js";
import { useDispatch } from "react-redux";
import { signupSuccess } from "../utils/authSlice.js";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  profilePicture: "",
  bio: "",
  dateOfBirth: "",
  password: "",
};

const Register = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blog-platform");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/doltg5a9m/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const imgData = await res.json();
      if (imgData.secure_url) {
        setForm({ ...form, profilePicture: imgData.secure_url });
        toast.success("Profile picture uploaded!");
      }
    } catch (err) {
      toast.error("Image upload failed.");
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);

      toast.success("Registration successful!");
      setForm(initialState);

      if (data.token) {
        dispatch(signupSuccess({ user: data.user, token: data.token }));
      }
      navigate("/home");
    } catch (err) {
      console.error("Register error:", err);
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Your Account
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            {!form.profilePicture ? (
              <label
                htmlFor="profilePicture"
                className="cursor-pointer flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow hover:from-purple-600 hover:to-blue-600 transition mb-2"
                title="Upload Photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4M16 12a4 4 0 01-8 0"
                  />
                </svg>
              </label>
            ) : (
              <div className="relative mt-2">
                <img
                  src={form.profilePicture}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover shadow cursor-pointer"
                  onClick={() =>
                    document.getElementById("profilePicture").click()
                  }
                  title="Change Photo"
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-purple-100 transition"
                  title="Edit Photo"
                  onClick={() =>
                    document.getElementById("profilePicture").click()
                  }
                  tabIndex={-1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L11 15H9v-2z"
                    />
                  </svg>
                </button>
              </div>
            )}
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />

          <textarea
            name="bio"
            placeholder="Bio (max 300 chars)"
            maxLength={300}
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div className="flex justify-between items-center mt-4 ml-25 text-sm">
          <a href="/login" className="text-blue-600 hover:underline ">
            Already have an account? Log in
          </a>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <Toaster position="top-center" />
      </form>
    </div>
  );
};

export default Register;
