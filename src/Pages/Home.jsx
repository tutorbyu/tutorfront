import React, { useState } from "react";
import SidePanel from "../Components/Home/SidePanel";
import Header from "../Components/Home/Header";
import TutorChat from "./TutorChat";
import CenterPanel from "../Components/Home/CenterPanel";
import NewChatModal from "../Components/Sidepannel/NewChatModal";
import axios from "axios";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [currentChatName, setCurrentChatName] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  /* Fetch chats once (example trigger) */
  const loadChats = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/tutor/api/chat",
        { user_id: user.user_id }
      );
      setChats(res.data.data || []);
    } catch (err) {
      console.error("Chat load failed", err);
    }
  };

  /* Create new chat */
 const handleCreateNewChat = async (chatName, file) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.user_id) {
      console.error("User not found");
      return;
    }

    const chatId = crypto.randomUUID();

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("user_id", user.user_id);
    formData.append("chat_name", chatName);
    if (file) {
      formData.append("file", file);
    }

    // 🔥 API CALL
    const res = await axios.post(
      "http://localhost:8000/tutor/api/create-chat",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ Only after success → update UI
    const newChat = {
      chat_id: chatId,
      chat_name: chatName,
      history: [],
      file: file || null,
      isNew: true,
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(chatId);
    setCurrentChatName(chatName);

  } catch (error) {
    console.error("Create chat failed:", error);
  }
};


  /* Select chat */
  const handleChatSelect = async (chatId) => {
    setActiveChatId(chatId);

    const selected = chats.find((c) => c.chat_id === chatId);
    if (selected) setCurrentChatName(selected.chat_name);

    try {
      const res = await axios.post(
        "http://localhost:8000/tutor/api/msg",
        { chat_id: chatId }
      );

      const messages =
        res.data?.data?.map((item) => ({
          sender: item.message.data.type,
          message: item.message.data.content,
          timestamp: item.created_at,
        })) || [];

      setChats((prev) =>
        prev.map((chat) =>
          chat.chat_id === chatId
            ? { ...chat, history: messages }
            : chat
        )
      );
    } catch (err) {
      console.error("Message fetch failed", err);
    }
  };

  const updateChatName = (id, name) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.chat_id === id ? { ...chat, chat_name: name } : chat
      )
    );
  };

  const activeChat = chats.find((c) => c.chat_id === activeChatId);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <SidePanel
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
        onRenameChat={updateChatName}
        currentChatName={currentChatName}
        setCurrentChatName={setCurrentChatName}
        onNewChat={() => setShowNewChatModal(true)}
      />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 overflow-auto">
          {activeChat ? (
            <TutorChat chat={activeChat} />
          ) : (
            <CenterPanel />
          )}
        </div>
      </div>

      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onCreate={handleCreateNewChat}
        />
      )}
    </div>
  );
};

export default Home;
