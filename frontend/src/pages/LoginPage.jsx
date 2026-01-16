import { useState } from "react";
import { Sun, AlertCircle, CheckCircle } from "lucide-react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [requiresVerification, setRequiresVerification] = useState(false);
  
  // States for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // States for create admin
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

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
      
      if (response.data.requiresVerification) {
        setRequiresVerification(true);
        setSuccess("Verification code sent to your email. Please enter the 6-digit code.");
      } else {
        // Fallback for old flow, but shouldn't happen
        setSuccess("Login Successful! Redirecting...");
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }

    } catch (err) {
      // 3. Robust Error Handling
      const errorMessage = 
        err.response?.data?.message || 
        "Something went wrong. Please try again.";
      setError(errorMessage);
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const verifyPinHandler = async (e) => {
    e.preventDefault();

    if (!pin || pin.length !== 6) {
      setError("Please enter a valid 6-digit PIN.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/verify-login-pin`,
        { email, pin }
      );
      
      setSuccess("Login Successful! Redirecting...");
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        "Invalid PIN. Please try again.";
      setError(errorMessage);
      console.error("Verify PIN Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateAdmin = () => {
    setShowCreateAdmin(true);
    setError("");
    setSuccess("");
  };

  const submitCreateAdmin = async (e) => {
    e.preventDefault();

    if (!createEmail || !createPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (createPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create-admin`,
        { email: createEmail, password: createPassword }
      );

      setSuccess("Admin account created successfully! You can now log in.");
      setShowCreateAdmin(false);
      setCreateEmail("");
      setCreatePassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create admin account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f2748]">
      <div className="bg-[#0b1c33] rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl max-w-4xl w-full">
        
        {/* Left */}
        <div className="md:w-1/2 flex flex-col justify-center items-center text-white p-10 ">
          <div className="flex mb-2">
            <img src="/companyLogo.png" alt="companyLogo" className="w-72 md:80" />
          </div>
          <img
            src="/LoginPanel.png"
            alt="Solar Panels"
            className="w-72 md:w-80 rounded-3xl"
          />
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex flex-col justify-center p-10">
          <h2 className="text-white text-4xl font-semibold mb-6">
            {showCreateAdmin ? "Create Admin" : "Login"}
          </h2>

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

          <form className="flex flex-col gap-5" onSubmit={showCreateAdmin ? submitCreateAdmin : (requiresVerification ? verifyPinHandler : submitHandler)}>
            {showCreateAdmin ? (
              <>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                    value={createEmail}
                    onChange={handleInputChange(setCreateEmail)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                    value={createPassword}
                    onChange={handleInputChange(setCreatePassword)}
                  />
                </div>
              </>
            ) : !requiresVerification ? (
              <>
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
              </>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit verification code"
                  className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
            )}
            
            {!requiresVerification && !showCreateAdmin && (
              <div className="flex justify-between items-center text-sm">
                <a
                  href="#"
                  className="text-blue-400 font-semibold hover:underline transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 font-semibold mt-2 transition-all flex justify-center items-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  {showCreateAdmin ? "Creating..." : requiresVerification ? "Verifying..." : "Logging in..."}
                </span>
              ) : (
                showCreateAdmin ? "Create Admin" : requiresVerification ? "Verify Code" : "Login"
              )}
            </button>

            {requiresVerification && (
              <button
                type="button"
                className="text-blue-400 font-semibold hover:underline transition-all text-sm"
                onClick={() => {
                  setRequiresVerification(false);
                  setPin("");
                  setError("");
                  setSuccess("");
                }}
              >
                Back to Login
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-blue-400 font-semibold hover:underline transition-all text-sm"
              onClick={() => {
                setShowCreateAdmin(!showCreateAdmin);
                setError("");
                setSuccess("");
                setRequiresVerification(false);
                setPin("");
              }}
            >
              {showCreateAdmin ? "Back to Login" : "Create Admin Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}