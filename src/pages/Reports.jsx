import { useData } from '../context/DataContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Reports.css';

export default function Reports() {
  const { properties, users, agents, leads, payments } = useData();

  const propertiesByCity = {};
  properties.forEach(p => {
    propertiesByCity[p.city] = (propertiesByCity[p.city] || 0) + 1;
  });

  const cityData = Object.entries(propertiesByCity).map(([city, count]) => ({
    city,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  const propertiesByType = [
    { type: 'Apartment', count: properties.filter(p => p.propertyType === 'apartment').length },
    { type: 'Villa', count: properties.filter(p => p.propertyType === 'villa').length },
    { type: 'House', count: properties.filter(p => p.propertyType === 'house').length },
    { type: 'Plot', count: properties.filter(p => p.propertyType === 'plot').length },
    { type: 'Commercial', count: properties.filter(p => p.propertyType === 'commercial').length }
  ];

  const priceRanges = [
    { range: '0-50L', count: properties.filter(p => p.price < 5000000).length },
    { range: '50L-1Cr', count: properties.filter(p => p.price >= 5000000 && p.price < 10000000).length },
    { range: '1-2Cr', count: properties.filter(p => p.price >= 10000000 && p.price < 20000000).length },
    { range: '2Cr+', count: properties.filter(p => p.price >= 20000000).length }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 125000, properties: 12 },
    { month: 'Feb', revenue: 185000, properties: 19 },
    { month: 'Mar', revenue: 142000, properties: 15 },
    { month: 'Apr', revenue: 220000, properties: 22 },
    { month: 'May', revenue: 165000, properties: 18 },
    { month: 'Jun', revenue: 285000, properties: 25 }
  ];

  const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];

  const exportToCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    return `${headers}\n${rows}`;
  };

  const handleExportProperties = () => {
    const data = properties.map(p => ({
      Title: p.title,
      Type: p.propertyType,
      Listing: p.listingType,
      Price: p.price,
      City: p.city,
      Status: p.status,
      Views: p.viewsCount
    }));
    exportToCSV(data, 'properties_report.csv');
  };

  const handleExportLeads = () => {
    const data = leads.map(l => ({
      PropertyId: l.propertyId,
      UserId: l.userId,
      Status: l.status,
      Priority: l.priority,
      Date: new Date(l.createdAt).toLocaleDateString()
    }));
    exportToCSV(data, 'leads_report.csv');
  };

  const handleExportPayments = () => {
    const data = payments.map(p => ({
      TransactionId: p.transactionId,
      Amount: p.amount,
      Status: p.status,
      Method: p.paymentMethod,
      Date: new Date(p.createdAt).toLocaleDateString()
    }));
    exportToCSV(data, 'payments_report.csv');
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Detailed insights and data exports</p>
        </div>
        <div className="export-buttons">
          <button className="btn-export" onClick={handleExportProperties}>
            📊 Export Properties
          </button>
          <button className="btn-export" onClick={handleExportLeads}>
            📊 Export Leads
          </button>
          <button className="btn-export" onClick={handleExportPayments}>
            📊 Export Payments
          </button>
        </div>
      </div>

      <div className="reports-stats">
        <div className="stat-box">
          <div className="stat-box-label">Total Properties</div>
          <div className="stat-box-value">{properties.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Total Users</div>
          <div className="stat-box-value">{users.length + agents.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Total Leads</div>
          <div className="stat-box-value">{leads.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Total Revenue</div>
          <div className="stat-box-value">₹{(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}K</div>
        </div>
      </div>

      <div className="reports-charts">
        <div className="report-chart-card">
          <h3 className="chart-title">Top 10 Cities by Properties</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="city" stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <YAxis stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Bar dataKey="count" fill="#4299e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="report-chart-card">
          <h3 className="chart-title">Properties by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertiesByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, count }) => `${type}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {propertiesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="report-chart-card">
          <h3 className="chart-title">Properties by Price Range</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <YAxis stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Bar dataKey="count" fill="#48bb78" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="report-chart-card chart-large">
          <h3 className="chart-title">Monthly Revenue & Properties</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <YAxis stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Line type="monotone" dataKey="revenue" stroke="#4299e1" strokeWidth={2} name="Revenue (₹)" />
              <Line type="monotone" dataKey="properties" stroke="#48bb78" strokeWidth={2} name="Properties Listed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
