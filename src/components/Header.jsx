import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h2 className="header-title">Admin Dashboard</h2>
        </div>
        <div className="header-right">
          <div className="header-notifications">
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
          </div>
          <div className="header-profile">
            <div className="profile-avatar">AD</div>
            <div className="profile-info">
              <div className="profile-name">Admin User</div>
              <div className="profile-role">Super Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
