// Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/properties", icon: Home, label: "Properties" },
    { path: "/users", icon: Users, label: "Owners", role: "owner" },
    { path: "/agents", icon: Users, label: "Agents", role: "agent" },
    { path: "/builders", icon: Users, label: "Builders", role: "builder" },
       { path: "/schedule", icon: Calendar, label: "Leads" },
    { path: "/buy-development", icon: Calendar, label: "Property Enquiry" },
    // { path: "/content", icon: LayoutDashboard, label: "Manage Content" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-[#1e3a5f] to-[#0f1e33] shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="px-6 border-b border-white/10 flex items-center gap-3">
        <img
          src="/vizaglogo.jpg"
          alt="VizagLands Logo"
          className="w-full h-20 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
    {menuItems.map((item) => {
      const Icon = item.icon;
      return (
        <button
          key={item.path + item.label}
          onClick={() => navigate(item.path, { state: { role: item.role } })}
          className="flex items-center w-full px-6 py-3 my-1 text-sm font-medium text-left transition-all border-l-4 text-white/70 border-transparent hover:bg-white/5 hover:text-white hover:border-white/20"
        >
          <Icon className="w-5 h-5 mr-3" />
          <span>{item.label}</span>
        </button>
      );
    })}
  </nav>

      {/* Logout Button */}
      <div className="border-t border-white/10 px-6 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
