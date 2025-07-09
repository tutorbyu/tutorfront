import React from 'react';
import TutorChat from '../../Pages/TutorChat';
import TutorVoice from '../../Pages/TutorVoice';
import VirtualTutor from '../../Pages/VirtualTutor';
import Login from '../GoogleSSO/Login';
const CenterPanel = ({ activeComponent, setActiveComponent }) => {
  const renderComponent = () => {
    switch (activeComponent) {
      case 'chat':
        return <TutorChat />;
      case 'audio':
        return <TutorVoice />;
      case 'virtual':
        return <VirtualTutor />;
      case 'login':
        return <Login/>
      default:
        return (
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mt-10 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Welcome to Tutor AI ✨
          </h2>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={() => setActiveComponent('chat')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
        >
          TutorChat
        </button>
        <button
          onClick={() => setActiveComponent('audio')}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
        >
          TutorAudio
        </button>
        <button
          onClick={() => setActiveComponent('virtual')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition"
        >
          VirtualTutor
        </button>
      </div>
      <div className="mt-10">{renderComponent()}</div>
    </div>
  );
};

export default CenterPanel;
