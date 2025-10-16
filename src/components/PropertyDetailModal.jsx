import { X, CheckCircle, XCircle } from "lucide-react";
import { useData } from "../context/DataContext";

export default function PropertyDetailModal({ userId, userType, properties, onClose }) {
  const { agents, builders, users, updatePropertyStatus } = useData();

  const getUserName = () => {
    if (userType === "agent") return agents.find(a => a.id === userId)?.fullName || "Unknown Agent";
    if (userType === "builder") return builders.find(b => b.id === userId)?.fullName || "Unknown Builder";
    return users.find(u => u.id === userId)?.fullName || "Unknown User";
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Properties by {getUserName()}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Property List */}
        <div className="p-6 flex flex-col gap-6">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition">
              {/* Image */}
              <div className="w-full h-64 bg-gray-100 overflow-hidden">
                {property.photos?.[0] ? (
                  <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${
                      property.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : property.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <Info label="Listing Type" value={property.listingType} />
                  <Info label="Type" value={property.propertyType} />
                  <Info label="City" value={property.city} />
                  <Info label="Locality" value={property.locality} />
                  <Info label="Price" value={formatCurrency(property.price)} highlight />
                  <Info label="Facing" value={property.facing} />
                  <Info label="Posted On" value={new Date(property.createdAt).toLocaleString()} />
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">{property.description}</p>

                {/* Approve / Reject Section */}
                {property.status === "pending" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => updatePropertyStatus(property.id, "approved")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => updatePropertyStatus(property.id, "rejected")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-medium ${highlight ? "text-green-600" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}
