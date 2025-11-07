export default function ConfirmDeleteModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = "Delete Confirmation", 
    message = "Are you sure you want to delete this item? This action cannot be undone."
  }) {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative">
          {/* Close button (top-right corner) */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
  
          {/* Header */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
  
          {/* Message */}
          <p className="text-gray-600 text-sm mb-6">{message}</p>
  
          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  