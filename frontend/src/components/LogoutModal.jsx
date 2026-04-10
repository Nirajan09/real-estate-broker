const LogoutModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-(--color-accent-light) rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-(--color-primary-dark) mb-4">
          Are you sure you want to logout?
        </h2>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;