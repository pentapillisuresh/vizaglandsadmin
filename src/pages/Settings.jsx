import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Loader, Building, Save, Eye, Lock, EyeOff, IdCard, FileText, Edit, X } from 'lucide-react';
import ApiService from '../hooks/ApiService';

const Setting = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phoneNumber: '+91 98765 43210',
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  const [originalData, setOriginalData] = useState({ ...profileData });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('token');
    const adminDetails = localStorage.getItem('adminDetails');
    const adminData = JSON.parse(adminDetails);
    const fetchAdminData = async () => {
      try {
        const res = await ApiService.get(`/clients/getAdmin/${adminData.id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        });
        setProfileData(res.admin);
        setOriginalData(res.admin);
        console.log(`/admins/getAdmin/${adminData.id}`, res.admin)

      } catch (error) {
        console.error("Error fetching admin:", error);
        alert("Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);


  // 🟣 Handle File Upload to Image API
  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);
    const adminToken = localStorage.getItem('token');

    try {
      const res = await ApiService.post("/images/upload", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return res.url; // Assuming your backend returns { imageUrl: "..." }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
      return null;
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, file) => {
    if (file) {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setProfileData((prev) => ({ ...prev, [field]: uploadedUrl }));
      }

    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original data
      setProfileData({ ...originalData });
    } else {
      // Start editing - save current state as original
      setOriginalData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const adminDetails = localStorage.getItem('adminDetails');
    const adminData = JSON.parse(adminDetails);
    const adminToken = localStorage.getItem('token');

    try {
      const res = await ApiService.put(`/clients/admin/${adminData.id}`,
        profileData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });
      alert("Profile updated successfully!");
      setProfileData(res.admin);
      setOriginalData(res.admin);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔐 Update Password
  const handlePasswordChange = async () => {
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    const adminToken = localStorage.getItem('token');
    const adminDetails = localStorage.getItem('adminDetails');
    const adminData = JSON.parse(adminDetails);
    console.log(`/admins/${adminData.id}//update-password`)
    try {
      await ApiService.put(`/clients/admin/${adminData.id}/update-password`,
        passwords, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data"
        }
      }
      );
      alert("Password updated successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Password update failed");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload('profilePic', file);
    }
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload('profilePic', file);
    }
  };

  //   {
  //     "id": "727dbc4b-204b-4381-a454-d24f44fbfa25",
  //     "fullName": "ravikumar",
  //     "phoneNumber": "9494130380",
  //     "email": "ark.kumar03@gmail.com",
  //     "role": "owner",
  //     "kycProofName": "ADHAR",
  //     "kycProofNumber": "12345678990",
  //     "kycUploadFile": null,
  //     "profilePic": null,
  //     "companyName": null,
  //     "address": null,
  //     "website": null,
  //     "bio": null,
  //     "postLimit": 2,
  //     "status": "active",
  //     "isVerified": true,
  //     "createdAt": "2025-10-23T05:59:32.000Z",
  //     "updatedAt": "2025-10-25T18:07:21.000Z"
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          {activeTab === 'profile' && (
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${isEditing
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'profile'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <User className="w-5 h-5 inline-block mr-2" />
                Profile Info
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'security'
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Lock className="w-5 h-5 inline-block mr-2" />
                Security
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Picture */}
                {/* <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                  <div className="relative">
                    <img
                      src={profileData.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    {isEditing && (
                      <div className="absolute bottom-0 right-0 flex gap-1">
                        <button
                          onClick={triggerFileInput}
                          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                          title="Upload from device"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={triggerCameraInput}
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                          title="Take photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900" style={{ textTransform: 'capitalize' }}>
                      {profileData.fullName}
                    </h3>
                    <p className="text-gray-600">{profileData.companyName}</p>
                    {isEditing && (
                      <p className="text-sm text-gray-500 mt-1">
                        Click buttons to upload or take a photo
                      </p>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleCameraCapture}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                          }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                          }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange('phoneNumber', e.target.value)
                        }
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                          }`}
                      />
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profileData.companyName}
                        onChange={(e) =>
                          handleInputChange('companyName', e.target.value)
                        }
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                          }`}
                      />
                    </div>
                  </div> */}
                </div>

                {/* Address */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`}
                  />
                </div> */}

                {/* Aadhaar & ID Verification */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        maxLength={12}
                        disabled={!isEditing}
                        value={profileData.kycProofNumber}
                        onChange={(e) =>
                          handleInputChange('kycProofNumber', e.target.value)
                        }
                        placeholder="Enter your Aadhaar number"
                        className={`w-full px-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`} />
                    </div>
                  </div>
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Aadhaar Proof
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) =>
                            handleFileUpload('kycUploadFile', e.target.files[0])
                          }
                          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      {profileData.kycUploadFile && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Preview:</p>
                          <img
                            src={profileData.kycUploadFile}
                            alt="Aadhaar Proof"
                            className="w-40 h-24 object-cover border rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div> */}

                {/* Bio */}
                {/* <div className="pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows="4"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`}
                  />
                </div> */}
              </div>
            )}
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, current: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwords.newPass}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, newPass: e.target.value }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="Enter your password"
                        />

                        {/* Eye Icon */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={(e) =>
                            setPasswords((p) => ({ ...p, confirm: e.target.value }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="Enter your password"
                        />

                        {/* Eye Icon */}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Includes at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Save/Cancel */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={activeTab === 'security' ? handlePasswordChange : handleSave}
                disabled={
                  isSaving ||
                  (activeTab === 'profile' && !isEditing)
                }
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : activeTab === 'security' ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Update Password
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;