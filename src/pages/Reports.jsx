import { useData } from "../context/DataContext";
import {
  BarChart,
  Bar,
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
  FileSpreadsheet,
  LineChart as LineIcon,
  BarChart3,
  PieChart as PieChartIcon,
  IndianRupee,
  Building2,
  Users,
  Target,
} from "lucide-react";

export default function Reports() {
  const {
    properties = [],
    users = [],
    agents = [],
    leads = [],
    payments = [],
  } = useData();

  /* -------- Data Grouping -------- */
  const propertiesByCity = {};
  properties.forEach((p) => {
    if (p.city) propertiesByCity[p.city] = (propertiesByCity[p.city] || 0) + 1;
  });

  const cityData = Object.entries(propertiesByCity)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const propertiesByType = [
    { type: "Apartment", count: properties.filter((p) => p.propertyType === "apartment").length },
    { type: "Villa", count: properties.filter((p) => p.propertyType === "villa").length },
    { type: "House", count: properties.filter((p) => p.propertyType === "house").length },
    { type: "Plot", count: properties.filter((p) => p.propertyType === "plot").length },
    { type: "Commercial", count: properties.filter((p) => p.propertyType === "commercial").length },
  ].filter((item) => item.count > 0);

  const priceRanges = [
    { range: "0-50L", count: properties.filter((p) => p.price && p.price < 5000000).length },
    {
      range: "50L-1Cr",
      count: properties.filter((p) => p.price >= 5000000 && p.price < 10000000).length,
    },
    {
      range: "1-2Cr",
      count: properties.filter((p) => p.price >= 10000000 && p.price < 20000000).length,
    },
    { range: "2Cr+", count: properties.filter((p) => p.price >= 20000000).length },
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 125000, properties: 12 },
    { month: "Feb", revenue: 185000, properties: 19 },
    { month: "Mar", revenue: 142000, properties: 15 },
    { month: "Apr", revenue: 220000, properties: 22 },
    { month: "May", revenue: 165000, properties: 18 },
    { month: "Jun", revenue: 285000, properties: 25 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  /* -------- CSV Export Logic -------- */
  const convertToCSV = (data) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${headers}\n${rows}`;
  };

  const exportToCSV = (data, filename) => {
    if (!data.length) {
      alert("No data available to export.");
      return;
    }
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProperties = () => {
    const data = properties.map((p) => ({
      Title: p.title,
      Type: p.propertyType,
      Listing: p.listingType,
      Price: p.price,
      City: p.city,
      Status: p.status,
      Views: p.viewsCount || 0,
    }));
    exportToCSV(data, "properties_report.csv");
  };

  const handleExportLeads = () => {
    const data = leads.map((l) => ({
      PropertyId: l.propertyId,
      UserId: l.userId,
      Status: l.status,
      Priority: l.priority,
      Date: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "Unknown",
    }));
    exportToCSV(data, "leads_report.csv");
  };

  const handleExportPayments = () => {
    const data = payments.map((p) => ({
      TransactionId: p.transactionId || "—",
      Amount: p.amount || 0,
      Status: p.status || "pending",
      Method: p.paymentMethod || "N/A",
      Date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Unknown",
    }));
    exportToCSV(data, "payments_report.csv");
  };

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  /* -------- UI -------- */
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Detailed insights and export options</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ExportButton label="Export Properties" onClick={handleExportProperties} icon={Building2} />
          <ExportButton label="Export Leads" onClick={handleExportLeads} icon={Target} />
          <ExportButton label="Export Payments" onClick={handleExportPayments} icon={IndianRupee} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Building2} label="Total Properties" value={properties.length} color="text-blue-600" />
        <StatCard icon={Users} label="Total Users" value={users.length + agents.length} color="text-green-600" />
        <StatCard icon={Target} label="Total Leads" value={leads.length} color="text-amber-600" />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${(totalRevenue / 1000).toFixed(1)}K`}
          color="text-indigo-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard title="Top 10 Cities by Properties" icon={BarChart3}>
          {cityData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="city" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No city data available" />
          )}
        </ReportCard>

        <ReportCard title="Properties by Type" icon={PieChartIcon}>
          {propertiesByType.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertiesByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ type, count }) => `${type}: ${count}`}
                  dataKey="count"
                >
                  {propertiesByType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="No property type data" />
          )}
        </ReportCard>

        <ReportCard title="Properties by Price Range" icon={BarChart}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Monthly Revenue & Properties" icon={LineIcon} full>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue (₹)" />
              <Line type="monotone" dataKey="properties" stroke="#10b981" strokeWidth={2} name="Properties Listed" />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function ExportButton({ label, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-blue-600 hover:text-white transition text-sm font-medium shadow-sm"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 mb-2 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-sm text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold text-gray-900 mt-1">{value}</div>
    </div>
  );
}

function ReportCard({ title, children, icon: Icon, full }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition ${
        full ? "lg:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="text-gray-400 text-sm text-center py-12">{text}</div>;
}
