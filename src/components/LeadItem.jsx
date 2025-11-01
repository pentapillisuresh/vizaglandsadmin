import React from "react";
import {
  Mail,
  Phone,
  Home,
  MapPin,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";

function LeadItem({ lead, onViewDetails, getStatusBadge, getPriorityBadge }) {
const photo=JSON.parse(lead?.property?.photos)[0];
console.log("rrr::",photo)
    return (
    <div className="p-6 hover:bg-gray-50 transition-colors border-b">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Property Image or Fallback */}
        {photo? (
          <img
            src={photo}
            alt={lead.property.title || "Property"}
            className="w-full lg:w-48 h-32 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full lg:w-48 h-32 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 text-sm">
            No Image
          </div>
        )}

        <div className="flex-1">
          {/* Lead Info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {lead.name || "Unnamed Lead"}
                </h3>
                {getStatusBadge?.(lead.status)}
                {getPriorityBadge?.(lead.priority)}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                {lead.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </span>
                )}
                {lead.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {lead.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Property Info */}
          {lead.property ? (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2 mb-2">
                <Home className="w-4 h-4 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {lead.property.title}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {lead.property.location}
                  </div>
                  <p className="text-orange-600 font-bold mt-1">
                    {lead.property.price}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-600 italic">
              Property ID: {lead.propertyId}
            </div>
          )}

          {/* Lead Message */}
          {lead.message && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600 mt-1" />
                <p className="text-sm text-gray-700 italic">
                  "{lead.message}"
                </p>
              </div>
            </div>
          )}

          {/* Date & Source */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {lead.createdAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(lead.createdAt).toLocaleDateString()} at{" "}
                {new Date(lead.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {lead.leadType && (
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                Source: {lead.leadType}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onViewDetails}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Details
            </button>

            {lead.phoneNumber && (
              <a
                href={`tel:${lead.phoneNumber}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            )}

            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadItem;
