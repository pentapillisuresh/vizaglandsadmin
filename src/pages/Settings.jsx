import { useState } from "react";
import { useData } from "../context/DataContext";
import BannerForm from "../components/BannerForm";
import {
  Globe,
  Image,
  UserCog,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Plus,
  Mail,
  Phone,
  Upload,
} from "lucide-react";

export default function Settings() {
  const {
    settings = {
      siteName: "RealEstate Admin",
      siteLogo: "",
      contactEmail: "",
      contactPhone: "",
    },
    banners = [],
    updateSettings = () => {},
    updateBanner = () => {},
    deleteBanner = () => {},
  } = useData();

  const [activeTab, setActiveTab] = useState("site");
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [siteSettings, setSiteSettings] = useState({
    siteName: settings.siteName || "",
    siteLogo: settings.siteLogo || "",
    contactEmail: settings.contactEmail || "",
    contactPhone: settings.contactPhone || "",
  });

  const handleSiteSettingsChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    updateSettings(siteSettings);
    alert("✅ Settings saved successfully!");
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowBannerForm(true);
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Configure system settings and preferences
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
          label="Banners Management"
          icon={Image}
          active={activeTab === "banners"}
          onClick={() => setActiveTab("banners")}
        />
        <TabButton
          label="Admin Users"
          icon={UserCog}
          active={activeTab === "admins"}
          onClick={() => setActiveTab("admins")}
        />
      </div>

      {/* Main content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* SITE SETTINGS */}
        {activeTab === "site" && (
          <form
            onSubmit={handleSaveSiteSettings}
            className="max-w-xl space-y-5"
          >
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

        {/* BANNERS */}
        {activeTab === "banners" && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Banner Management
              </h3>
              <button
                onClick={() => setShowBannerForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-500 text-white rounded-lg shadow hover:shadow-md text-sm"
              >
                <Plus className="w-4 h-4" /> Add Banner
              </button>
            </div>

            {banners.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div
                      className="h-40 bg-cover bg-center relative"
                      style={{
                        backgroundImage: `url(${
                          banner.imageUrl ||
                          "https://via.placeholder.com/400x200"
                        })`,
                      }}
                    >
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          banner.isActive ? "bg-green-600" : "bg-gray-500"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {banner.title || "Untitled"}
                      </h4>
                      <p className="text-sm text-gray-500 mb-1">
                        Position: {banner.position || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Order: {banner.displayOrder || 0}
                      </p>

                      <div className="flex gap-2 border-t border-gray-200 pt-3">
                        <ActionButton
                          icon={Edit}
                          title="Edit"
                          color="text-blue-600"
                          onClick={() => handleEditBanner(banner)}
                        />
                        <ActionButton
                          icon={banner.isActive ? Unlock : Lock}
                          title="Toggle Status"
                          color="text-green-600"
                          onClick={() =>
                            updateBanner(banner.id, {
                              isActive: !banner.isActive,
                            })
                          }
                        />
                        <ActionButton
                          icon={Trash2}
                          title="Delete"
                          color="text-red-600"
                          onClick={() => handleDeleteBanner(banner.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm py-12">
                No banners configured
              </div>
            )}
          </div>
        )}

        {/* ADMINS */}
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

      {/* Banner Form Modal */}
      {showBannerForm && (
        <BannerForm
          banner={editingBanner}
          onClose={() => {
            setShowBannerForm(false);
            setEditingBanner(null);
          }}
        />
      )}
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

function ActionButton({ icon: Icon, title, color, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition"
    >
      <Icon className={`w-4 h-4 ${color}`} />
    </button>
  );
}
