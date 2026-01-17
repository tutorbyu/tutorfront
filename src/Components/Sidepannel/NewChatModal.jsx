import { useState } from "react";

export default function NewChatModal({ onClose, onCreate }) {
  const [chatName, setChatName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!chatName.trim()) return;
    onCreate(chatName, file);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-5">

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">
          Create New Chat
        </h2>

        {/* Chat Name Input (Rich Feel) */}
        <div className="border rounded-lg p-3 focus-within:ring-2 ring-blue-500">
          <input
            type="text"
            placeholder="Chat name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="w-full outline-none text-sm"
            autoFocus
          />
        </div>

        {/* File Upload */}
        <label className="mt-4 flex items-center gap-2 text-sm cursor-pointer text-gray-600">
          📎 Attach file
          <input
            type="file"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <span className="text-xs text-green-600">
              {file.name}
            </span>
          )}
        </label>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
