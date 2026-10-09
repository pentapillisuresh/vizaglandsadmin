// Sidebar.jsx
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
  BluetoothSearching,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/properties", icon: Home, label: "Properties" },
    { path: "/projects", icon: Home, label: "Projects" },
    { path: "/handOverProperties", icon: Home, label: "HandOver Properties" },
    { path: "/users", icon: Users, label: "Owners", role: "owner" },
    { path: "/agents", icon: Users, label: "Agents", role: "agent" },
    { path: "/builders", icon: Users, label: "Builders", role: "builder" },
    { path: "/schedule", icon: Calendar, label: "Leads" },
    { path: "/blog", icon: BluetoothSearching, label: "Blog" },
    { path: "/buy-development", icon: Calendar, label: "Property Enquiry" },
    { path: "/content", icon: LayoutDashboard, label: "Manage Content" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Determine if we are on a /property/... detail page and where it came from
  const isPropertyDetailPage = location.pathname.startsWith("/property/");
  const fromSource = new URLSearchParams(location.search).get("from"); // "projects" | "properties" | null

  // ✅ Check if a specific menu item should be marked as active
  const isItemActive = (item, routerIsActive) => {
    if (routerIsActive) return true;

    // Highlight the correct parent when on /property/:title
    if (isPropertyDetailPage) {
      if (fromSource === "projects" && item.path === "/projects") return true;
      if (fromSource === "properties" && item.path === "/properties") return true;
    }
    return false;
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-[#1e3a5f] to-[#0f1e33] shadow-lg flex flex-col z-50">

      {/* Header / Logo */}
      <div className="h-20 px-6 bg-white border-b border-gray-200 flex items-center justify-center">
        <img
          src="/vizaglogo.jpg"
          alt="VizagLands Logo"
          className="w-full h-16 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              end={item.path === "/"}
              state={{ role: item.role }}
              className={({ isActive }) =>
                `flex items-center w-full px-6 py-3 my-1 text-sm font-medium text-left transition-all border-l-4 ${
                  isItemActive(item, isActive)
                    ? "bg-white/10 text-white border-orange-500"
                    : "text-white/70 border-transparent hover:bg-white/5 hover:text-white hover:border-white/20"
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </NavLink>
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