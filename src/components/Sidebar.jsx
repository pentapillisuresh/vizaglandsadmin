import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/properties", icon: Home, label: "Properties" },
    { path: "/users", icon: Users, label: "Users & Agents" },
    // { path: "/leads", icon: MessageSquare, label: "Leads" },
    { path: "/payments", icon: CreditCard, label: "Payments & Plans" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-[#1e3a5f] to-[#0f1e33] shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
          RealEstate
        </h1>
        <p className="text-xs text-white/60 font-light">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 my-1 text-sm font-medium transition-all border-l-4 ${
                  isActive
                    ? "bg-blue-500/20 text-white border-blue-400"
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
    </aside>
  );
}
