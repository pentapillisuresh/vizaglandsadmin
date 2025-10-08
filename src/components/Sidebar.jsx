import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/properties', icon: '🏠', label: 'Properties' },
    { path: '/users', icon: '👥', label: 'Users & Agents' },
    { path: '/leads', icon: '💬', label: 'Leads' },
    { path: '/payments', icon: '💰', label: 'Payments & Plans' },
    { path: '/reports', icon: '📈', label: 'Reports' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">RealEstate</h1>
        <p className="sidebar-subtitle">Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
