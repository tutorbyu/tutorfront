import React from 'react';

const SidePanel = ({
  mode,
  chats,
  onNewChat,
  onChatSelect,
  onRenameChat,
  activeChatId,
  setCurrentChatName,
}) => {




  
  return (
    <div className="bg-blue-900 text-white w-full md:w-64 p-4 md:h-full">
      <h2 className="text-xl font-bold mb-4">Tutor AI</h2>

      {mode === 'default' && (
        <nav className="space-y-2 hidden md:block">
          <div className="hover:bg-blue-700 p-2 rounded cursor-pointer">Dashboard</div>
          <div className="hover:bg-blue-700 p-2 rounded cursor-pointer">Settings</div>
        </nav>
      )}

      {mode === 'chat' && (
        <div className="space-y-4">
          <button
            onClick={onNewChat}
            className="w-full bg-blue-700 hover:bg-blue-600 py-2 rounded text-white font-semibold"
          >
            ➕ New Chat
          </button>

          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Chat History</h3>
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {chats.map((chat) => (
                <li
                  key={chat.chat_id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    chat.chat_id === activeChatId
                      ? 'bg-blue-600'
                      : 'hover:bg-blue-800'
                  }`}
                  onClick={() => onChatSelect(chat.chat_id)}
                >
                  <input
                    className="bg-transparent w-full text-white text-sm focus:outline-none border-b border-blue-300"
                    value={chat.chatname}
                    onChange={(e) =>{
                     setCurrentChatName(e.target.value); // updates temporary variable
                    onRenameChat(chat.chat_id, e.target.value); // updates UI state
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;

