import { useState } from 'react';
import { useData } from '../context/DataContext';
import BannerForm from '../components/BannerForm';
import './Settings.css';

export default function Settings() {
  const { settings, banners, updateSettings, updateBanner, deleteBanner } = useData();
  const [activeTab, setActiveTab] = useState('site');
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [siteSettings, setSiteSettings] = useState({
    siteName: settings.siteName,
    siteLogo: settings.siteLogo,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone
  });

  const handleSiteSettingsChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    updateSettings(siteSettings);
    alert('Settings saved successfully!');
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowBannerForm(true);
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteBanner(id);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure system settings and preferences</p>
        </div>
      </div>

      <div className="settings-tabs">
        <button className={activeTab === 'site' ? 'settings-tab active' : 'settings-tab'} onClick={() => setActiveTab('site')}>
          🌐 Site Configuration
        </button>
        <button className={activeTab === 'banners' ? 'settings-tab active' : 'settings-tab'} onClick={() => setActiveTab('banners')}>
          🖼️ Banners Management
        </button>
        <button className={activeTab === 'admins' ? 'settings-tab active' : 'settings-tab'} onClick={() => setActiveTab('admins')}>
          👤 Admin Users
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'site' && (
          <div className="settings-card">
            <h3 className="settings-card-title">Site Configuration</h3>
            <form onSubmit={handleSaveSiteSettings} className="settings-form">
              <div className="form-group">
                <label className="form-label">Site Name *</label>
                <input
                  type="text"
                  name="siteName"
                  value={siteSettings.siteName}
                  onChange={handleSiteSettingsChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Site Logo URL</label>
                <input
                  type="url"
                  name="siteLogo"
                  value={siteSettings.siteLogo}
                  onChange={handleSiteSettingsChange}
                  className="form-input"
                />
                {siteSettings.siteLogo && (
                  <div className="logo-preview">
                    <img src={siteSettings.siteLogo} alt="Logo Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={siteSettings.contactEmail}
                  onChange={handleSiteSettingsChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={siteSettings.contactPhone}
                  onChange={handleSiteSettingsChange}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Save Settings
              </button>
            </form>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="settings-card">
            <div className="banners-header">
              <h3 className="settings-card-title">Banner Management</h3>
              <button className="btn-primary" onClick={() => setShowBannerForm(true)}>
                + Add Banner
              </button>
            </div>
            <div className="banners-grid">
              {banners.map(banner => (
                <div key={banner.id} className="banner-item">
                  <div className="banner-image" style={{ backgroundImage: `url(${banner.imageUrl})` }}>
                    <span className={`banner-status ${banner.isActive ? 'active' : 'inactive'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="banner-info">
                    <h4 className="banner-title">{banner.title}</h4>
                    <p className="banner-position">Position: {banner.position}</p>
                    <p className="banner-order">Order: {banner.displayOrder}</p>
                    <div className="banner-actions">
                      <button className="btn-icon" onClick={() => handleEditBanner(banner)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn-icon" onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })} title="Toggle Status">
                        {banner.isActive ? '🔓' : '🔒'}
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDeleteBanner(banner.id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {banners.length === 0 && (
              <div className="empty-state">No banners configured</div>
            )}
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="settings-card">
            <h3 className="settings-card-title">Admin Users</h3>
            <div className="admin-info-box">
              <p>Admin user management is available through the Users & Agents section.</p>
              <p>Navigate to the Users & Agents page to manage admin accounts and roles.</p>
            </div>
          </div>
        )}
      </div>

      {showBannerForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => { setShowBannerForm(false); setEditingBanner(null); }}
        />
      )}
    </div>
  );
}
