import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  Users,
  PlusCircle,
  Edit3,
  Trash2,
  Pin,
} from "lucide-react";
import { useData } from "../context/DataContext";

export default function Dashboard() {
  const {
    properties = [],
    users = [],
    agents = [],
    activityLogs = [],
  } = useData();

  const activeProperties = properties.filter((p) => p.status === "active").length;
  const pendingProperties = properties.filter((p) => p.status === "pending").length;
  const soldProperties = properties.filter((p) => p.status === "sold").length;

  const propertyTypeData = [
    { name: "Apartment", value: properties.filter((p) => p.propertyType === "apartment").length },
    { name: "Villa", value: properties.filter((p) => p.propertyType === "villa").length },
    { name: "House", value: properties.filter((p) => p.propertyType === "house").length },
    { name: "Plot", value: properties.filter((p) => p.propertyType === "plot").length },
    { name: "Commercial", value: properties.filter((p) => p.propertyType === "commercial").length },
  ].filter((item) => item.value > 0);

  const monthlyData = [
    { month: "Jan", properties: 12 },
    { month: "Feb", properties: 19 },
    { month: "Mar", properties: 15 },
    { month: "Apr", properties: 22 },
    { month: "May", properties: 18 },
    { month: "Jun", properties: 25 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
  const recentActivities = (activityLogs || []).slice(0, 8);

  return (
    <div className="max-w-[1600px] space-y-10 p-4">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor your real estate business performance
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Home className="w-7 h-7 text-blue-500" />}
          label="Total Properties"
          value={properties.length}
          detail={`${activeProperties} Active · ${pendingProperties} Pending · ${soldProperties} Sold`}
        />
        <StatCard
          icon={<Users className="w-7 h-7 text-green-500" />}
          label="Total Users"
          value={users.length + agents.length}
          detail={`${agents.length} Agents · ${users.length} Customers`}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
            Monthly Properties Added
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="properties" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
            Property Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {propertyTypeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVITY + QUICK STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
            Recent Activities
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-md border border-gray-200">
                    {getActivityIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-800">
                      <strong>{log.action}</strong> on {log.entityType}{" "}
                      {log.details?.title && `- ${log.details.title}`}
                      {log.details?.fullName && ` - ${log.details.fullName}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(log.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">No recent activities</div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="divide-y divide-gray-200">
            <QuickStat
              label="Featured Properties"
              value={properties.filter((p) => p.isFeatured).length}
            />
            <QuickStat
              label="Total Views"
              value={properties.reduce((sum, p) => sum + (p.viewsCount || 0), 0)}
            />
            <QuickStat
              label="Active Agents"
              value={agents.filter((a) => a.isActive).length}
            />
            <QuickStat
              label="Verified Users"
              value={users.filter((u) => u.isVerified).length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */
function StatCard({ icon, label, value, detail }) {
  return (
    <div className="bg-white rounded-xl p-5 flex items-start gap-4 border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-50">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
          {label}
        </p>
        <h4 className="text-2xl font-serif font-bold text-gray-900 leading-none">
          {value}
        </h4>
        <p className="text-sm text-gray-400 mt-1">{detail}</p>
      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-900 font-semibold text-base">{value}</span>
    </div>
  );
}

/* ---------- Utilities ---------- */
function getActivityIcon(action) {
  const icons = {
    CREATE: <PlusCircle className="w-5 h-5 text-blue-500" />,
    UPDATE: <Edit3 className="w-5 h-5 text-amber-500" />,
    DELETE: <Trash2 className="w-5 h-5 text-red-500" />,
  };
  return icons[action] || <Pin className="w-5 h-5 text-gray-500" />;
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const diffMs = new Date() - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
