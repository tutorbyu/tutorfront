import React, { useState } from 'react';
import SidePanel from '../Components/Home/SidePanel';
import Header from '../Components/Home/Header';
import TutorChat from './TutorChat';
import CenterPanel from '../Components/Home/CenterPanel';
import axios from 'axios';

const Home = () => {
  const [mode, setMode] = useState('default');
  const [activeComponent, setActiveComponent] = useState('');
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [currentChatName, setCurrentChatName] = useState('');


const handleTutorChatClick = async () => {
  setMode('chat');
  setActiveComponent('chat');
  


 

  const userData = localStorage.getItem('user'); // assuming it's stored like this

  const userLoad = JSON.parse(userData);
 
  console.log(userLoad);
  console.log(userLoad.user_id);

  if (!userLoad) {
    console.error('No user_id found in localStorage');
    return;
  }

  try {
    const res = await axios.post('http://localhost:8000/tutor/api/chat', {
      user_id: userLoad.user_id,
    });
     console.log(res.data.data);
    setChats(res.data.data); // expects [{chat_id, chat_name}]
    console.log(res.data);
  } catch (err) {
    console.error('Failed to fetch chat list:', err);
  }
};

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      chat_id: newId,
      chat_name: `New Chat ${chats.length + 1}`,
      history: [],
      isNew: true,  
    };
    setChats([...chats, newChat]);
    setActiveChatId(newId);
  };


  
  const markChatAsSaved = (chatId) => {
  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.chat_id === chatId ? { ...chat, isNew: false } : chat
    )
  );
};


const handleChatSelect = async (chatId) => {
  setActiveChatId(chatId);
  setActiveComponent('chat');


  const selected = chats.find((chat) => chat.chat_id === chatId);
  if (selected) setCurrentChatName(selected.chat_name);

  try {
    const res = await axios.post("http://localhost:8000/tutor/api/msg", {
      chat_id: chatId,
    });

    const rawData = res.data?.data || [];

    const messages = rawData.map((item) => ({
      sender: item.message.data.type, // 'human' or 'ai'
      message: item.message.data.content,
      timestamp: item.created_at,
    }));

    setChats((prev) =>
      prev.map((chat) =>
        chat.chat_id === chatId ? { ...chat, history: messages } : chat
      )
    );
  } catch (err) {
    console.error('Failed to fetch chat messages:', err);
  }
};



  const updateChatName = (id, newName) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.chat_id === id ? { ...chat, chat_name: newName } : chat
      )
    );
  };

  const activeChat = chats.find((chat) => chat.chat_id === activeChatId);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <SidePanel
        mode={mode}
        chats={chats}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onRenameChat={updateChatName}
        activeChatId={activeChatId}
        currentChatName={currentChatName}
        setCurrentChatName={setCurrentChatName}
      />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 overflow-auto">
         {activeComponent === 'chat' && activeChat ? (
        <TutorChat
          chat={activeChat}
          markChat={markChatAsSaved}
          currentChatName={currentChatName}
          updateChat={(chatId, entry) => {
            setChats((prev) =>
              prev.map((chat) =>
                chat.chat_id === chatId
                  ? { ...chat, history: [...(chat.history || []), entry] }
                  : chat
              )
            );
          }}
        />
      ) : (
        <CenterPanel setActiveComponent={handleTutorChatClick} />
      )}

        </div>
      </div>
    </div>
  );
};

export default Home;
