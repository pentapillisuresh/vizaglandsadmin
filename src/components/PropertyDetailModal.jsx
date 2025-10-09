import { X } from "lucide-react";
import { useData } from "../context/DataContext";

export default function PropertyDetailModal({ userId, userType, properties, onClose }) {
  const { agents, builders, users } = useData();

  const getUserName = () => {
    if (userType === "agent") {
      const agent = agents.find((a) => a.id === userId);
      return agent?.fullName || "Unknown Agent";
    } else if (userType === "builder") {
      const builder = builders.find((b) => b.id === userId);
      return builder?.fullName || "Unknown Builder";
    } else if (userType === "customer") {
      const user = users.find((u) => u.id === userId);
      return user?.fullName || "Unknown Customer";
    }
    return "Unknown User";
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Properties Posted by {getUserName()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Property List */}
        <div className="p-6 flex flex-col gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="w-full h-[300px] bg-gray-100 overflow-hidden">
                {property.photos?.length > 0 ? (
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex justify-between flex-wrap gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {property.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-semibold capitalize ${
                      property.status === "active"
                        ? "bg-green-100 text-green-800"
                        : property.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <Info label="Listing Type" value={property.listingType} />
                  <Info label="Property Type" value={property.propertyType} />
                  <Info label="Property Subtype" value={property.propertySubtype || "N/A"} />
                  <Info label="Price" value={formatCurrency(property.price)} highlight />
                  <Info label="City" value={property.city} />
                  <Info label="Locality" value={property.locality} />
                  <Info label="Sub Locality" value={property.subLocality || "N/A"} />
                  <Info label="Apartment/Society" value={property.apartmentSociety || "N/A"} />
                  <Info
                    label="Plot Area"
                    value={`${property.plotArea} ${property.plotAreaUnit || ""}`}
                  />
                  <Info
                    label="Dimensions"
                    value={`${property.length} × ${property.breadth}`}
                  />
                  <Info label="Facing" value={property.facing} />
                  <Info label="Project Name" value={property.projectName || "N/A"} />
                  <div className="col-span-full">
                    <Info label="Description" value={property.description} multiline />
                  </div>
                  <Info label="Views" value={property.viewsCount || 0} />
                  <Info
                    label="Posted By"
                    value={property.postedBy}
                    badge="bg-indigo-100 text-indigo-800"
                  />
                  <Info
                    label="Created At"
                    value={new Date(property.createdAt).toLocaleString()}
                  />
                  <Info
                    label="Updated At"
                    value={new Date(property.updatedAt).toLocaleString()}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Sub Component */
function Info({ label, value, highlight, badge, multiline }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {badge ? (
        <span className={`px-2 py-1 rounded-md text-sm font-semibold ${badge}`}>
          {value}
        </span>
      ) : (
        <span
          className={`text-[15px] font-medium text-gray-800 ${
            highlight ? "text-emerald-600 text-lg font-bold" : ""
          } ${multiline ? "leading-relaxed" : ""}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}
