import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCog, Building2, Home, Clock, CheckCircle, XCircle, Eye, MessageSquare, FolderKanban, TrendingUp, Calendar } from "lucide-react";
import ApiService from "../hooks/ApiService";
import LeadItem from "../components/LeadItem";
import LeadDetailModal from "../components/LeadDetailModal";
import getPhotoSrc from "../hooks/getPhotos";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showProperty, setShowProperty] = useState(true);
  const [showLeads, setShowLeads] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const adminToken = localStorage.getItem('token');
      try {
        const res = await ApiService.get("/dashboard/admin",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchAdminClient = async () => {
      try {
        setLoading(true);
        const adminToken = localStorage.getItem('token');

        const res = await ApiService.get(`/clients/getClientByRole/admin`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );;
        if (!res) throw new Error("Failed to fetch owners");


        if (Array.isArray(res.clients)) {
          // Normalize the data to match table expectations
          const formattedUsers = res.clients.map((client) => ({
            id: client.id,
            fullName: client.fullName,
            email: client.email,
            phone: client.phoneNumber,
            status: client.status === "active",
            isVerified: client.isVerified,
            postLimit: client.postLimit || 0,
            profilePic: client.profilePic,
            role: client.role
          }));
          const adminClientData = JSON.stringify(formattedUsers)
          localStorage.setItem("adminClientData", adminClientData)
        }
      } catch (err) {
        console.error("Error fetching owners:", err);
        // setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminClient();
  }, []);

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
      contacted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Contacted' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' }
    };
    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔥' },
      medium: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚡' },
      low: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📋' }
    };
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon} {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
      </span>
    );
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  const stats = {
    totalOwners: dashboardData.OwnerCount,
    totalAgents: dashboardData.AgentCount,
    totalBuilders: dashboardData.BuilderCount,
    totalProperties: dashboardData.addedPropertiesCount,
    totalProjects: dashboardData.ProjectsCount,
    verifiedProperties: dashboardData.verifiedPropertiesCount,
    totalViews: dashboardData.totalViews,
    totalLeads: dashboardData.totalLeadsCount,
    totalThisMonthViews: dashboardData.totalThisMonthViews,
    totalInquiries: dashboardData.Inquiries,
  };

  const recentProperties = dashboardData.properties
    ?.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your property management system
        </p>
      </div>

      {/* Row 1: Owners, Agents, Builders, Properties, Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Owners */}
        <div
          onClick={() => {
            navigate("/users", { state: { role: "owner" } })
          }}
          className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Owners</p>
              <p className="text-3xl font-bold">{stats.totalOwners}</p>
            </div>
          </div>
        </div>

        {/* Agents */}
        <div
          onClick={() => {
            navigate("/users", { state: { role: "agent" } })
          }} 
          className="cursor-pointer bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <UserCog className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Agents</p>
              <p className="text-3xl font-bold">{stats.totalAgents}</p>
            </div>
          </div>
        </div>

        {/* Builders */}
        <div
          onClick={() => {
            navigate("/users", { state: { role: "builders" } })
          }}
          className="cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Builders</p>
              <p className="text-3xl font-bold">{stats.totalBuilders}</p>
            </div>
          </div>
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
            {stats.verifiedProperties} Verified
          </div>
        </div>

        {/* Projects */}
        <div
          onClick={() => handleNavigate("/projects")}
          className="cursor-pointer bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <FolderKanban className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Projects</p>
              <p className="text-3xl font-bold">{stats.totalProjects}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">
            Active Projects
          </div>
        </div>
      </div>

      {/* Row 2: Total Views, Total Leads, Total Inquiries, Verified Properties, Monthly Views */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Views */}
        <div 
          className="cursor-pointer bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
          onClick={() => {
            setShowProperty(true);
            setShowLeads(false);
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Views</p>
              <p className="text-3xl font-bold">{stats.totalViews}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">
            All time views
          </div>
        </div>

        {/* Total Leads */}
        <div 
          className="cursor-pointer bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
          onClick={() => {
            setShowProperty(false)
            setShowLeads(true)
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <UserCog className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Leads</p>
              <p className="text-3xl font-bold">{stats.totalLeads}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">New leads generated</div>
        </div>

        {/* Total Inquiries */}
        <div 
          className="cursor-pointer bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
          onClick={() => {
            console.log("inquiries")
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Inquiries</p>
              <p className="text-3xl font-bold">{stats.totalInquiries}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">Customer property inquiries</div>
        </div>

        {/* Verified Properties */}
        <div 
          className="cursor-pointer bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
          onClick={() => handleNavigate("/properties")}
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Verified Properties</p>
              <p className="text-3xl font-bold">{stats.verifiedProperties}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">Approved and live listings</div>
        </div>

        {/* Monthly Views */}
        <div 
          className="cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:scale-[1.03] transition-transform"
          onClick={() => {
            console.log("monthly views")
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">This Month Views</p>
              <p className="text-3xl font-bold">{stats.totalThisMonthViews}</p>
            </div>
          </div>
          <div className="text-xs opacity-90">Views in current month</div>
        </div>
      </div>

      {/* Row 3: Recent Activity or Additional Stats (if needed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Approvals - Example additional card */}
        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Pending Approvals</p>
              <p className="text-3xl font-bold">
                {dashboardData.properties?.filter(p => p.status === "pending").length || 0}
              </p>
            </div>
          </div>
          <div className="text-xs opacity-90">Properties awaiting verification</div>
        </div>

        {/* Total Revenue - Placeholder */}
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">₹0</p>
            </div>
          </div>
          <div className="text-xs opacity-90">Coming soon</div>
        </div>

        {/* Active Listings */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Home className="w-8 h-8 opacity-80" />
            <div className="text-right">
              <p className="text-sm opacity-90">Active Listings</p>
              <p className="text-3xl font-bold">
                {dashboardData.properties?.filter(p => p.status === "verified").length || 0}
              </p>
            </div>
          </div>
          <div className="text-xs opacity-90">Currently active properties</div>
        </div>
      </div>

      {/* 🏠 Recent Properties */}
      {showProperty && <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Properties
          </h2>
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
              {recentProperties?.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getPhotoSrc(property.photos)}
                        alt={property.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {property.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {property.category?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {property.address?.city || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{parseFloat(property.price).toLocaleString("en-IN")}
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
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {property.client?.role || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      
      {showLeads && <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Leads
          </h2>
        </div>
        <div className="overflow-x-auto">
          {dashboardData?.leads.map((lead) => (
            <LeadItem
              key={lead.id}
              lead={lead}
              onViewDetails={() => handleViewDetails(lead)}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
            />
          ))}
        </div>
      </div>}
      
      {showDetailModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setShowDetailModal(false)}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
        />
      )}
    </div>
  );
}