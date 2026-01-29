import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-[70px] bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-40 shadow-sm flex items-center justify-between px-8">
      {/* Left Section */}
      <div>
        <h2 className="font-serif text-[22px] font-semibold text-gray-800">
          Admin Dashboard
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          {/* <button className="relative flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[11px] font-semibold px-1.5 py-[1px] rounded-full leading-none">
              3
            </span>
          </button> */}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1e3a5f] to-[#4299e1] flex items-center justify-center text-white font-semibold text-sm">
            AD
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800">
              Admin User
            </span>
            <span className="text-xs text-gray-500">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
