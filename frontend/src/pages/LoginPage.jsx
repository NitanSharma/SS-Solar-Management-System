import { useState } from "react";
import { Sun, AlertCircle, CheckCircle } from "lucide-react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("sharma123@gmail.com");
  const [password, setPassword] = useState("tiger123sharmaA@");
  
  // States for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Reset messages when user types
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
    setSuccess("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // 1. Client-side Validation (Save server resources)
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const admin = { email, password };
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/login`,
        admin
      );
      console.log(response.data);
      // 2. Success Handling
      setSuccess("Login Successful! Redirecting...");
      localStorage.setItem("token", response.data.token);

      // Slight delay so user sees the success message before redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      // 3. Robust Error Handling
      // If server sends a message (like "Invalid credentials"), show that. 
      // Otherwise show a generic error.
      const errorMessage = 
        err.response?.data?.message || 
        "Something went wrong. Please try again.";
      setError(errorMessage);
      console.error("Login Error:", err);
    } finally {
      // 4. Always turn off loading, even if error occurs
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2748]">
      <div className="bg-[#0b1c33] rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl max-w-4xl w-full">
        
        {/* Left Illustration Section */}
        <div className="md:w-1/2 flex flex-col justify-center items-center text-white p-10 ">
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

        {/* Right Login Section */}
        <div className="md:w-1/2 flex flex-col justify-center p-10">
          <h2 className="text-white text-4xl font-semibold mb-6">Login</h2>

          {/* 5. Dynamic Feedback Messages */}
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

          <form className="flex flex-col gap-5" onSubmit={submitHandler}>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={handleInputChange(setPassword)}
              />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <a
                href="#"
                className="text-blue-400 font-semibold hover:underline transition-all"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 font-semibold mt-2 transition-all flex justify-center items-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                // Optional: You can add a spinner icon here
                <span>Logging in...</span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}