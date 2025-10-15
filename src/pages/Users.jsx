import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import PropertyDetailModal from "../components/PropertyDetailModal";
import {
  Check,
  X,
  Lock,
  Unlock,
  Trash2,
  Search,
  User,
  Users,
  Briefcase,
} from "lucide-react";

export default function UsersPage() {
  const {
    users,
    agents,
    builders,
    properties,
    updateUser,
    deleteUser,
    updateAgent,
    deleteAgent,
    updateBuilder,
    deleteBuilder,
  } = useData();

  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingProperty, setViewingProperty] = useState(null);

  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [filteredAgentsList, setFilteredAgentsList] = useState([]);
  const [filteredBuildersList, setFilteredBuildersList] = useState([]);

  useEffect(() => {
    const filterBySearch = (list) =>
      list.filter(
        (i) =>
          i.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredUsersList(filterBySearch(users));
    setFilteredAgentsList(filterBySearch(agents));
    setFilteredBuildersList(filterBySearch(builders));
  }, [searchTerm, users, agents, builders]);

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "user") deleteUser(id);
      else if (type === "agent") deleteAgent(id);
      else deleteBuilder(id);
    }
  };

  const handleToggleActive = (id, isActive, type) => {
    const fn =
      type === "user"
        ? updateUser
        : type === "agent"
        ? updateAgent
        : updateBuilder;
    fn(id, { isActive: !isActive });
  };

  const handleVerify = (id, isVerified, type) => {
    const fn =
      type === "user"
        ? updateUser
        : type === "agent"
        ? updateAgent
        : updateBuilder;
    fn(id, { isVerified: !isVerified });
  };

  const handleViewProperties = (userId, userType) => {
    const userProperties = properties.filter(
      (p) => p.userId === userId && p.postedBy === userType
    );
    if (userProperties.length > 0) {
      setViewingProperty({ userId, userType, properties: userProperties });
    } else {
      alert("No properties found for this user");
    }
  };

  const renderTableRows = (list, type) =>
    list.map((user, idx) => {
      const propertyCount = properties.filter(
        (p) => p.userId === user.id && p.postedBy === type
      ).length;
      return (
        <tr
          key={user.id}
          className={`${
            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
          } hover:bg-blue-50 transition-colors`}
        >
          <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
            {user.fullName}
          </td>
          {type === "builder" && (
            <td className="px-5 py-3 whitespace-nowrap text-gray-700">
              {user.companyName || <span className="text-gray-400">N/A</span>}
            </td>
          )}
          <td className="px-5 py-3 text-gray-700">{user.email}</td>
          <td className="px-5 py-3 text-gray-700">
            {user.phone || <span className="text-gray-400">N/A</span>}
          </td>
          <td className="px-5 py-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                user.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </span>
          </td>
          <td className="px-5 py-3">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                user.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
            {new Date(user.createdAt).toLocaleDateString()}
          </td>
          <td className="px-5 py-3">
            {propertyCount > 0 ? (
              <button
                className="text-blue-600 hover:underline text-sm font-medium"
                onClick={() => handleViewProperties(user.id, type)}
              >
                View ({propertyCount})
              </button>
            ) : (
              <span className="text-gray-400 text-sm">None</span>
            )}
          </td>
          <td className="px-5 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleVerify(user.id, user.isVerified, type)}
                title="Toggle Verification"
                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 transition"
              >
                {user.isVerified ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <X className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <button
                onClick={() => handleToggleActive(user.id, user.isActive, type)}
                title="Toggle Active"
                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 transition"
              >
                {user.isActive ? (
                  <Unlock className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => handleDelete(user.id, type)}
                title="Delete"
                className="p-1.5 border border-gray-200 rounded-md hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </td>
        </tr>
      );
    });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-500">
            Manage customers, agents, and builders efficiently
          </p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "customers", label: "Owners", icon: <User />, count: users.length },
            { id: "agents", label: "Agents", icon: <Users />, count: agents.length },
            { id: "builders", label: "Builders", icon: <Briefcase />, count: builders.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full sm:w-72 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3">Name</th>
                {activeTab === "builders" && <th className="px-5 py-3">Company</th>}
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Verified</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Properties</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === "customers" &&
                renderTableRows(filteredUsersList, "customer")}
              {activeTab === "agents" &&
                renderTableRows(filteredAgentsList, "agent")}
              {activeTab === "builders" &&
                renderTableRows(filteredBuildersList, "builder")}
            </tbody>
          </table>
        </div>

        {((activeTab === "customers" && filteredUsersList.length === 0) ||
          (activeTab === "agents" && filteredAgentsList.length === 0) ||
          (activeTab === "builders" && filteredBuildersList.length === 0)) && (
          <div className="text-center text-gray-400 text-sm py-10">
            No {activeTab} found
          </div>
        )}
      </div>

      {/* Property Modal */}
      {viewingProperty && (
        <PropertyDetailModal
          userId={viewingProperty.userId}
          userType={viewingProperty.userType}
          properties={viewingProperty.properties}
          onClose={() => setViewingProperty(null)}
        />
      )}
    </div>
  );
}
