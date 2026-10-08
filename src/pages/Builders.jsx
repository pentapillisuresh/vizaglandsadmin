import { useState, useEffect } from "react";
import UserDetails from "../components/UserDetails";
import {
  Search,
  Users as UsersIcon,
  Eye,Delete,
  CheckCircle,
  FileText,
} from "lucide-react";
import ApiService from "../hooks/ApiService";
import { useLocation } from "react-router-dom";

export default function Builders() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const { role } = location.state || {};  // 🔹 State
  // 🔹 Fetch users from API
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        setLoading(true);
        setError("");
        const adminToken = localStorage.getItem('token');

        const res = await ApiService.get(`/clients/getClientByRole/${role}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (!res) throw new Error("Failed to fetch builders");


        if (Array.isArray(res.clients)) {
          // Normalize the data to match table expectations
          const formattedUsers = res.clients.map((client) => ({
            id: client.id,
            fullName: client.fullName,
            email: client.email,
            phone: client.phoneNumber,
            companyName: client.companyName,
            address: client.address,
            area: client.area,
            kycProofName: client.kycProofName,
            kycProofNumber: client.kycProofNumber,
            kycUploadFile: client.kycUploadFile,
            createdAt: client.createdAt,
            isActive: client.status === "active",
            isDocsVerified: client.isVerified,
            propertiesAdded: client.properties?.length || 0,
            propertyLimit: client.postLimit || 0,
            canAddProperty:
              (client.properties?.length || 0) < (client.postLimit || 0),
            properties: client.properties || [],
            profilePic: client.profilePic,
          }));
          setUsers(formattedUsers);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching builders:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuilders();
  }, []);

  // 🔹 Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && user.isActive) ||
      (filter === "inactive" && !user.isActive);
    return matchesSearch && matchesFilter;
  });

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <p className="text-gray-500 text-sm">Loading builders...</p>
      </div>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 text-center">
        <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Builder Management</h1>
          <p className="text-sm text-gray-500">
            View and manage property builders
          </p>
        </div>
      </div>

      {/* 🔹 Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm rounded-lg border transition font-medium ${filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Table */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Builder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Doc Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {user.propertiesAdded}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          / {user.propertyLimit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.canAddProperty ? "Can add" : "Cannot add"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isDocsVerified ? (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-amber-600">
                          <FileText className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 gap-3 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        title="View Details"
                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <UsersIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No builders found
          </h3>
          <p className="text-sm text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* 🔹 User Details Modal */}
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          type="Builder"
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
