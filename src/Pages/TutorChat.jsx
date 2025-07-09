import React, { useState, useEffect } from 'react';

const TutorChat = ({chat, updateChat,markChat }) => {
  const [file, setFile] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // const [sessionValue, setSessionValue] = useState(
  //   sessionStorage.getItem('key_id') || ''
  // );

  const [chatHistory, setChatHistory] = useState(chat?.history || []);
useEffect(() => {
  if (chat?.history) {
    console.log('📚 Updated chatHistory:', chat.history);
    setChatHistory(chat.history);
  }
}, [chat?.chat_id, chat?.history]);




  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  // const handleSession = (sessionKey) => {
  //   sessionStorage.setItem('key_id', sessionKey);
  //   setSessionValue(sessionKey);
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  if ((!file && !chat?.chat_id) || !userInput.trim()) return;

  const question = userInput;
  setLoading(true);
  setUserInput('');


  const userId = JSON.parse(localStorage.getItem('user')).user_id;
  const formData = new FormData();
  if (file) formData.append('file', file); // Only append if file exists
  formData.append('question', question);
  if(!chat.isNew) formData.append('session_id', chat.chat_id);
  formData.append('user_id', userId);
  formData.append('chat_name', chat.chat_name);
  formData.append('chat_name', chat.chat_name);
  formData.append('is_new', chat.isNew);
  // chat.isNew==true ? formData.append('isNew', 'Y') : formData.append('isNew', 'N') ;
  console.log(chat.chat_name);
  console.log(chat.chat_id);
  console.log(chat.isNew);
  try {
    const res = await fetch('http://localhost:8000/tutor/api/ask-doc', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    const aiAnswer = data.response.answer || 'No answer found.';
    const newSession = data.response.session_id;
    // handleSession(newSession);
 

 

    const userMessage = {
      sender: 'human',
      message: question,
      timestamp: new Date().toISOString(),
    };

    const aiMessage = {
      sender: 'ai',
      message: aiAnswer,
      timestamp: new Date().toISOString(),
    };

    // ✅ Append messages locally
    setChatHistory((prev) => [...prev, userMessage, aiMessage]);

    // Optional: persist to parent/global chat store
    updateChat(newSession, userMessage);
    updateChat(newSession, aiMessage);
    markChat(chat.chat_id);
  
  } catch (err) {
    console.error('Upload failed:', err);
  }

  setLoading(false);
};


  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 md:p-10 bg-gray-100 overflow-auto">
      <div className="text-center text-2xl md:text-3xl font-bold text-blue-700">
        💬 Welcome to Tutor Chat
      </div>

      {/* File Upload */}
      <div className="w-full bg-gray-800 text-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Upload a PDF or DOCX file</h2>
        {!file ? (
          <div className="border border-gray-600 border-dashed rounded-lg p-4 mb-4">
            <label className="block cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center text-sm">
                Click or Drag and drop file here
              </div>
            </label>
          </div>
        ) : (
          <div className="text-sm mb-2">
            📄 {file.name}
            <button
              onClick={() => {
                setFile(null);
                setChatHistory([]);
              }}
              className="ml-2 text-red-400 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Chat Area */}
      {(file ||  chatHistory.length > 0) && (
        <div className="w-full flex flex-col bg-white p-4 rounded-lg shadow border border-gray-200 h-[60vh] overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${
                chat.sender === 'human' ? 'justify-end' : 'justify-start'
              } mb-2`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md text-sm ${
                  chat.sender === 'human'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Input */}
      {(file || chatHistory.length > 0 ) &&  (
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-end gap-2 bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <textarea
            placeholder="Ask a question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows="2"
            className="flex-1 p-2 rounded border bg-gray-100 resize-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? '...' : 'Go'}
          </button>
        </form>
      )}
    </div>
  );
};

export default TutorChat;
