import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../utils/authSlice.js";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      toast.success("Login successful!");
      if (data.token) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        navigate("/home");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Try again.";
      toast.error(message || "Login failed.");
    }

    setLoading(false);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!resetEmail) return toast.error("Please enter your email.");
    try {
      await api.post("/auth/forgot-password", { email: resetEmail });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
    } catch (err) {
      toast.error("Failed to send OTP.");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP.");
    try {
      const { data } = await api.post("/auth/verify-otp", {
        email: resetEmail,
        token: otp,
      });
      if (data.success) {
        toast.success("OTP verified! You can now reset your password.");
        setOtpVerified(true);
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (err) {
      toast.error("Failed to verify OTP.");
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Enter new password.");
    try {
      const {data}=await api.post("/auth/reset-password", {
        email: resetEmail,
        token:otp,
        newPassword,
      });
      if(data.token) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
      }
      toast.success("Password reset successful!");
      setShowReset(false);
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setNewPassword("");
      setResetEmail("");
      navigate("/home");
    } catch (err) {
      toast.error("Failed to reset password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Sign In
        </h2>
        {!showReset ? (
          <>
            <div className="space-y-4">
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
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                type="button"
                className="text-purple-600 hover:underline"
                onClick={() => setShowReset(true)}
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/register")}
              >
                Sign up
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  className="w-full py-2 mt-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition border border-gray-300"
                  onClick={() => setShowReset(false)}
                >
                  Back to Login
                </button>
              </>
            ) : !otpVerified ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  className="w-full py-2 mt-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition border border-gray-300"
                  onClick={() => {
                    setShowReset(false);
                    setOtpSent(false);
                    setOtp("");
                    setResetEmail("");
                  }}
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition shadow-lg"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  className="w-full py-2 mt-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition border border-gray-300"
                  onClick={() => {
                    setShowReset(false);
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp("");
                    setNewPassword("");
                    setResetEmail("");
                  }}
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        )}
        <Toaster position="top-center" />
      </form>
    </div>
  );
};

export default Login;
