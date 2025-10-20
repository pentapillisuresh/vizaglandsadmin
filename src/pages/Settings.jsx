import { useState } from "react";
import { useData } from "../context/DataContext";
import {
  Globe,
  UserCog,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Upload,
} from "lucide-react";

export default function Settings() {
  const {
    settings = {
      siteName: "VIZAG LANDS Admin",
      siteLogo: "",
      contactEmail: "",
      contactPhone: "",
    },
    updateSettings = () => {},
  } = useData();

  const [activeTab, setActiveTab] = useState("site");

  const [siteSettings, setSiteSettings] = useState({
    siteName: settings.siteName || "",
    siteLogo: settings.siteLogo || "",
    contactEmail: settings.contactEmail || "",
    contactPhone: settings.contactPhone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
  });

  const handleSiteSettingsChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    updateSettings(siteSettings);
    alert("✅ Site settings updated successfully!");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setPasswordData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("⚠️ Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("❌ New password and confirm password do not match.");
      return;
    }

    // Add your password update logic here (API call, etc.)
    alert("✅ Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage configuration and account preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <TabButton
          label="Site Configuration"
          icon={Globe}
          active={activeTab === "site"}
          onClick={() => setActiveTab("site")}
        />
        <TabButton
          label="Change Password"
          icon={Lock}
          active={activeTab === "password"}
          onClick={() => setActiveTab("password")}
        />
        <TabButton
          label="Admin Users"
          icon={UserCog}
          active={activeTab === "admins"}
          onClick={() => setActiveTab("admins")}
        />
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* SITE SETTINGS */}
        {activeTab === "site" && (
          <form onSubmit={handleSaveSiteSettings} className="max-w-xl space-y-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Site Configuration
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name *
              </label>
              <input
                type="text"
                name="siteName"
                value={siteSettings.siteName}
                onChange={handleSiteSettingsChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Logo URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  name="siteLogo"
                  value={siteSettings.siteLogo}
                  onChange={handleSiteSettingsChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Upload className="w-5 h-5 text-gray-400 mt-2" />
              </div>
              {siteSettings.siteLogo && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <img
                    src={siteSettings.siteLogo}
                    alt="Logo Preview"
                    className="max-h-20 mx-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email *
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="contactEmail"
                  value={siteSettings.contactEmail}
                  onChange={handleSiteSettingsChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone *
              </label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  name="contactPhone"
                  value={siteSettings.contactPhone}
                  onChange={handleSiteSettingsChange}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition text-sm font-medium"
            >
              Save Settings
            </button>
          </form>
        )}

        {/* CHANGE PASSWORD */}
        {activeTab === "password" && (
          <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Change Password
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password *
              </label>
              <input
                type={passwordData.showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                type={passwordData.showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={passwordData.showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {passwordData.showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md transition text-sm font-medium"
            >
              Update Password
            </button>
          </form>
        )}

        {/* ADMINS INFO */}
        {activeTab === "admins" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Admin Users
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-gray-700 text-sm leading-relaxed">
              <p>
                Admin user management is available through the{" "}
                <strong>Users & Agents</strong> section.
              </p>
              <p>
                Navigate there to manage admin accounts, roles, and access
                levels.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border transition-all ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
