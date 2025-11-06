import { useState } from "react";
import { Sun } from "lucide-react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
      e.preventDefault();
      const admin ={
        email: email,
        password: password
      }
      console.log(admin);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/login`, admin);

      if(response.status === 200){
        const data = response.data;
        console.log(data);
        // setCaptain(data.token);
        localStorage.setItem('token', data.token);
        navigate('/dashboard')
      }
      
      setEmail('');
      setPassword('');
    }

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
        <div className="md:w-1/2  flex flex-col justify-center p-10">
          <h2 className="text-white text-4xl font-semibold mb-8">Login</h2>

          <form className="flex flex-col gap-5" onSubmit={(e) => submitHandler(e)}>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => {
                setEmail(e.target.value)}
               } 
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-md outline-none bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 font-semibold mt-2 transition-all"
            >
              LOGIN
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
