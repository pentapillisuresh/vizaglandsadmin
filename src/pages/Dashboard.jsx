import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCog,
  Building2,
  Home,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Dashboard() {
  const { users, agents, builders, properties } = useData();
  const navigate = useNavigate(); // ✅ for navigation

  const stats = {
    totalCustomers: users.length,
    activeCustomers: users.filter((u) => u.isActive).length,
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.isActive).length,
    totalBuilders: builders.length,
    activeBuilders: builders.filter((b) => b.isActive).length,
    totalProperties: properties.length,
    pendingProperties: properties.filter((p) => p.status === "pending").length,
    approvedProperties: properties.filter(
      (p) => p.status === "approved"
    ).length,
    rejectedProperties: properties.filter(
      (p) => p.status === "rejected"
    ).length,
  };

  const recentProperties = properties
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Helper for navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your property management system
        </p>
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Owners */}
        <div
          onClick={() => handleNavigate("/users")}
          className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Owners</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">{stats.activeCustomers} Active</div>
        </div>

        {/* Agents */}
        <div
          onClick={() => handleNavigate("/agents")}
          className="cursor-pointer bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <UserCog className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Agents</p>
              <p className="text-3xl font-bold">{stats.totalAgents}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">{stats.activeAgents} Active</div>
        </div>

        {/* Builders */}
        <div
          onClick={() => handleNavigate("/builders")}
          className="cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Builders</p>
              <p className="text-3xl font-bold">{stats.totalBuilders}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">{stats.activeBuilders} Active</div>
        </div>

        {/* Properties */}
        <div
          onClick={() => handleNavigate("/properties")}
          className="cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <Home className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Properties</p>
              <p className="text-3xl font-bold">{stats.totalProperties}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">
            {stats.approvedProperties} Approved
          </div>
        </div>
      </div>

      {/* ✅ Property Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingProperties}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Properties awaiting approval</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approvedProperties}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Live on the platform</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.rejectedProperties}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Not approved for listing</div>
        </div>
      </div>

      {/* ✅ Recent Properties Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Posted By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          property.photos?.[0] ||
                          "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                        }
                        alt={property.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {property.title}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {property.propertySubtype}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {property.city}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{property.price?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                        property.status
                      )}`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                    {property.postedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
