import { useState } from "react";
import { Sun, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: pin, 3: new password

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
    setSuccess("");
  };

  const requestResetCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/forgot-password`,
        { email }
      );

      setSuccess("Reset code sent to your email. Please check your inbox.");
      setStep(2);

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(errorMessage);
      console.error("Forgot Password Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPinAndReset = async (e) => {
    e.preventDefault();

    if (!pin || pin.length !== 6) {
      setError("Please enter a valid 6-digit PIN.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/reset-password`,
        { email, pin, newPassword }
      );

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Invalid PIN or something went wrong. Please try again.";
      setError(errorMessage);
      console.error("Reset Password Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2748]">
      <div className="bg-[#0b1c33] rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl max-w-4xl w-full">
        
        {/* Left Illustration Section */}
        <div className="md:w-1/2 flex flex-col justify-center items-center text-white p-10">
          <div className="flex gap-3 mb-8">
            <Sun className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-wide">SS SOLAR</h1>
          </div>
          <img
            src="/LoginPanel.png"
            alt="Solar Panels"
            className="w-72 md:w-80 rounded-3xl"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 flex flex-col justify-center p-10">
          <h2 className="text-white text-4xl font-semibold mb-6">Forgot Password</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-500 bg-red-100/10 border border-red-500/20 rounded-md">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 mb-4 text-sm text-green-500 bg-green-100/10 border border-green-500/20 rounded-md">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {step === 1 && (
            <form className="flex flex-col gap-5" onSubmit={requestResetCode}>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                />
              </div>

              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 font-semibold mt-2 transition-all flex justify-center items-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="flex flex-col gap-5" onSubmit={verifyPinAndReset}>
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit reset code"
                  className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={handleInputChange(setNewPassword)}
                />
              </div>

              <button
                type="submit"
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 font-semibold mt-2 transition-all flex justify-center items-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <button
            type="button"
            className="flex items-center gap-2 text-blue-400 font-semibold hover:underline transition-all text-sm mt-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}