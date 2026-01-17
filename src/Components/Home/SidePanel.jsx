import React from "react";

const SidePanel = ({
  chats,
  activeChatId,
  onChatSelect,
  onRenameChat,
  currentChatName,
  setCurrentChatName,
  onNewChat,
}) => {
  return (
    <div className="bg-blue-900 text-white w-full md:w-64 p-4 md:h-full">
      <h2 className="text-xl font-bold mb-4">Tutor AI</h2>

      <button
        onClick={onNewChat}
        className="w-full px-4 py-2 bg-blue-600 rounded-lg mb-4"
      >
        + New Chat
      </button>

      <h3 className="text-sm font-semibold mb-2 text-gray-300">
        Chats
      </h3>

      <ul className="space-y-2 text-sm max-h-[70vh] overflow-y-auto">
        {chats.map((chat) => (
          <li
            key={chat.chat_id}
            className={`p-2 rounded cursor-pointer ${
              chat.chat_id === activeChatId
                ? "bg-blue-600"
                : "hover:bg-blue-800"
            }`}
            onClick={() => onChatSelect(chat.chat_id)}
          >
            <input
              className="bg-transparent w-full text-white text-sm focus:outline-none border-b border-blue-300"
              value={
                chat.chat_id === activeChatId
                  ? currentChatName
                  : chat.chat_name
              }
              onChange={(e) => {
                setCurrentChatName(e.target.value);
                onRenameChat(chat.chat_id, e.target.value);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidePanel;
