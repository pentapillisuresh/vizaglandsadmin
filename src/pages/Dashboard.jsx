import { useData } from '../context/DataContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const { properties, users, agents, leads, payments, activityLogs } = useData();

  const activeProperties = properties.filter(p => p.status === 'active').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  const soldProperties = properties.filter(p => p.status === 'sold').length;
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  const propertyTypeData = [
    { name: 'Apartment', value: properties.filter(p => p.propertyType === 'apartment').length },
    { name: 'Villa', value: properties.filter(p => p.propertyType === 'villa').length },
    { name: 'House', value: properties.filter(p => p.propertyType === 'house').length },
    { name: 'Plot', value: properties.filter(p => p.propertyType === 'plot').length },
    { name: 'Commercial', value: properties.filter(p => p.propertyType === 'commercial').length }
  ];

  const leadStatusData = [
    { name: 'New', value: leads.filter(l => l.status === 'new').length },
    { name: 'Contacted', value: leads.filter(l => l.status === 'contacted').length },
    { name: 'Qualified', value: leads.filter(l => l.status === 'qualified').length },
    { name: 'Converted', value: leads.filter(l => l.status === 'converted').length },
    { name: 'Closed', value: leads.filter(l => l.status === 'closed').length }
  ];

  const monthlyData = [
    { month: 'Jan', properties: 12, leads: 45, revenue: 125000 },
    { month: 'Feb', properties: 19, leads: 52, revenue: 185000 },
    { month: 'Mar', properties: 15, leads: 38, revenue: 142000 },
    { month: 'Apr', properties: 22, leads: 65, revenue: 220000 },
    { month: 'May', properties: 18, leads: 48, revenue: 165000 },
    { month: 'Jun', properties: 25, leads: 72, revenue: 285000 }
  ];

  const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];

  const recentActivities = activityLogs.slice(0, 8);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Monitor your real estate business performance</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <div className="stat-label">Total Properties</div>
            <div className="stat-value">{properties.length}</div>
            <div className="stat-detail">
              {activeProperties} Active · {pendingProperties} Pending · {soldProperties} Sold
            </div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length + agents.length}</div>
            <div className="stat-detail">
              {agents.length} Agents · {users.length} Customers
            </div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-label">Active Leads</div>
            <div className="stat-value">{leads.length}</div>
            <div className="stat-detail">
              {leads.filter(l => l.status === 'new').length} New · {leads.filter(l => l.priority === 'high').length} High Priority
            </div>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₹{(totalRevenue / 1000).toFixed(0)}K</div>
            <div className="stat-detail">
              {payments.filter(p => p.status === 'pending').length} Pending Payments
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card chart-large">
          <h3 className="chart-title">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <YAxis stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Line type="monotone" dataKey="properties" stroke="#4299e1" strokeWidth={2} name="Properties Listed" />
              <Line type="monotone" dataKey="leads" stroke="#48bb78" strokeWidth={2} name="Leads Generated" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Property Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Lead Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <YAxis stroke="#718096" style={{ fontSize: 12, fontFamily: 'Roboto' }} />
              <Tooltip contentStyle={{ fontFamily: 'Roboto', fontSize: 13 }} />
              <Bar dataKey="value" fill="#4299e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="activity-card">
          <h3 className="card-title">Recent Activities</h3>
          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map(log => (
                <div key={log.id} className="activity-item">
                  <div className="activity-icon">{getActivityIcon(log.action)}</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>{log.action}</strong> on {log.entityType}
                      {log.details?.title && ` - ${log.details.title}`}
                      {log.details?.fullName && ` - ${log.details.fullName}`}
                    </div>
                    <div className="activity-time">{formatTime(log.createdAt)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No recent activities</div>
            )}
          </div>
        </div>

        <div className="quick-stats-card">
          <h3 className="card-title">Quick Stats</h3>
          <div className="quick-stats-list">
            <div className="quick-stat-item">
              <span className="quick-stat-label">Featured Properties</span>
              <span className="quick-stat-value">{properties.filter(p => p.isFeatured).length}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Total Views</span>
              <span className="quick-stat-value">{properties.reduce((sum, p) => sum + p.viewsCount, 0)}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Active Agents</span>
              <span className="quick-stat-value">{agents.filter(a => a.isActive).length}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Verified Users</span>
              <span className="quick-stat-value">{users.filter(u => u.isVerified).length}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">Completed Payments</span>
              <span className="quick-stat-value">{payments.filter(p => p.status === 'completed').length}</span>
            </div>
            <div className="quick-stat-item">
              <span className="quick-stat-label">High Priority Leads</span>
              <span className="quick-stat-value">{leads.filter(l => l.priority === 'high').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getActivityIcon(action) {
  const icons = {
    CREATE: '✨',
    UPDATE: '📝',
    DELETE: '🗑️'
  };
  return icons[action] || '📌';
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
