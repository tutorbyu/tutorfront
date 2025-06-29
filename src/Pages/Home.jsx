
import axios from 'axios';
import React, { useState } from "react";
import { Room, createLocalAudioTrack } from "livekit-client";

export const VoiceAssistant = () => {
  const [connected, setConnected] = useState(false);

  const joinRoom = async () => {

    
    try {
      const res = await fetch("http://localhost:5000/api/token");
      console.log("🔗 Fetching token from server...");
      const { token, url } = await res.json();
      console.log("🔑 Token received:");
        

      const room = new Room();
      await room.connect(url, token);

      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);
      console.log("🎤 Microphone track published");

      room.on("participantConnected", (participant) => {
        console.log("👥 Participant connected:", participant.identity);
      });


      room.on("trackSubscribed", (track, publication, participant) => {
        console.log("🔊 Subscribed to track:", track.kind, participant.identity)
        if (track.kind === "audio") {
          const audio = track.attach();
          audio.autoplay = true;
          document.body.appendChild(audio);
          console.log("🎧 Assistant audio attached.");
        }
      });

      setConnected(true);
    } catch (err) {
      console.error("❌ Voice assistant error:", err);
    }
  };

  return (
    <div className="text-green-500">
      {connected ? (
        "🎙️ Voice Assistant Connected"
      ) : (
        <button onClick={joinRoom}>🔊 Start Voice Assistant</button>
      )}
    </div>
  );
};



const Home = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !question) return alert('Please provide both a file and a question.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ask-doc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnswer(response.data.answer || 'No answer found.');
    } catch (error) {
      console.error(error);
      setAnswer('Failed to get a response from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col md:flex-row">
      {/* Upload Form */}
      <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Upload a PDF or DOCX file</h2>

       <div className="border border-gray-600 border-dashed rounded-lg p-4 mb-4">
          <label className="block cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm">Click or Drag and drop file here</div>
            </div>
          </label>
        </div>
        {file && (
          <div className="text-sm mb-2">
            📄 {file.name} <button onClick={() => setFile(null)} className="text-red-400">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Ask a question about the document"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="4"
            className="w-full p-2 rounded bg-gray-700 mb-4"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Answer */}
      <div className="w-full md:w-2/3 p-8">
        <h1 className="text-2xl font-bold mb-4">Document Assistant</h1>
        <h2 className="text-lg font-semibold mb-2">Answer:</h2>
        <p className="text-gray-300">{answer}</p>

        {/* Voice Assistant UI */}
        <div className="mt-8 p-4 bg-gray-800 rounded shadow text-center border border-gray-700">
          <VoiceAssistant />
        </div>

      </div>
    </div>
  );
};

export default Home;