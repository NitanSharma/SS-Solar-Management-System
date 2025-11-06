
import { Sun } from "lucide-react";
import { FaUserCircle} from "react-icons/fa";

const Navbar = () => {
  return (
     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 space-y-4 md:space-y-0 px-4">
      {/* Left Section */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center space-x-2">
          <Sun className="w-7 h-7" />
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            SS SOLAR
          </h1>
          <span className="hidden sm:inline text-gray-400 tracking-wide font-bold text-lg md:text-xl ml-2">
            MANAGEMENT SYSTEM
          </span>
        </div>

        {/* User icon visible on small screens */}
        {/* <div className="flex md:hidden items-center space-x-2">
          <FaUserCircle className="text-3xl text-gray-300" />
        </div> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 justify-end w-full md:w-auto">
        <input
          type="text"
          placeholder="Search Client"
          className="bg-[#12293F] px-4 py-2 rounded-lg text-sm focus:outline-none w-full md:w-64 placeholder-gray-400"
        />
        {/* <FaUserCircle className="hidden md:block text-3xl text-gray-300" /> */}
      </div>
    </div>
  )
}

export default Navbar