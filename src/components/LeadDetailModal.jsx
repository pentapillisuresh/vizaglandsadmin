import { Mail, Phone, User, MapPin } from "lucide-react";

const LeadDetailModal = ({ lead, onClose, getStatusBadge, getPriorityBadge }) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{lead.name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{lead.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{lead.phoneNumber || "N/A"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Message */}
          {lead.message && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Customer Message
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700">{lead.message}</p>
              </div>
            </section>
          )}

          {/* Lead Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Lead Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                {getStatusBadge(lead.status)}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Priority</p>
                {getPriorityBadge(lead.priority)}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Lead Type</p>
                <p className="font-semibold text-gray-900">
                  {lead.leadType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Property ID</p>
                <p className="font-semibold text-gray-900">
                  {lead.propertyId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(lead.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Updated At</p>
                <p className="font-semibold text-gray-900">
                  {new Date(lead.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {lead.phoneNumber && (
              <a
                href={`tel:${lead.phoneNumber}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <Phone className="w-5 h-5" />
                Call Customer
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
