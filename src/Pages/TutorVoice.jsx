import axios from 'axios';
import React, { useState } from "react";
// import { Room, createLocalAudioTrack } from "livekit-client";

import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

const TutorVoice = () => {

  // const [connected, setConnected] = useState(false);

  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => setUserInput(result),
  });

  const { speak } = useSpeechSynthesis();


    const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    // Append user message
    setChatHistory(prev => [...prev, { type: 'user', text: userInput }]);

    try {
      const response = await fetch('http://localhost:8000/tutor/api/ask-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await response.json();
      const answer = data.response || "I couldn't understand.";

      // Append bot response
      setChatHistory(prev => [...prev, { type: 'bot', text: answer }]);

      // Speak out the response
      speak({ text: answer });

    } catch (error) {
      console.error('Error fetching RAG response:', error);
      speak({ text: "Sorry, there was a problem getting the answer." });
    }

    setUserInput('');
    setLoading(false);
  };


  // const joinRoom = async () => {

    
  //   try {
  //     const res = await fetch("http://localhost:8000/tutor/api/token");
  //     console.log("🔗 Fetching token from server...");
  //     const { token, url } = await res.json();
  //     console.log("🔑 Token received:");
        

  //     const room = new Room();
  //     await room.connect(url, token);

  //     const audioTrack = await createLocalAudioTrack();
  //     await room.localParticipant.publishTrack(audioTrack);
  //     console.log("🎤 Microphone track published");

  //     room.on("participantConnected", (participant) => {
  //       console.log("👥 Participant connected:", participant.identity);
  //     });


  //     room.on("trackSubscribed", (track, publication, participant) => {
  //       console.log("🔊 Subscribed to track:", track.kind, participant.identity)
  //       if (track.kind === "audio") {
  //         const audio = track.attach();
  //         audio.autoplay = true;
  //         document.body.appendChild(audio);
  //         console.log("🎧 Assistant audio attached.");
  //       }
  //     });

  //     setConnected(true);
  //   } catch (err) {
  //     console.error("❌ Voice assistant error:", err);
  //   }
  // };


  return(
    <>

      <div className="text-center text-xl text-gray-700">🎧 You're in Tutor Audio!</div>
  <div style={{ maxWidth: 500, margin: 'auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h2>🧠 RAG Voice Assistant</h2>

      <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'auto', padding: 10 }}>
        {chatHistory.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.type === 'user' ? 'right' : 'left' }}>
            <b>{msg.type === 'user' ? 'You' : 'Bot'}:</b> {msg.text}
          </div>
        ))}
      </div>

      <textarea
        rows="2"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Speak or type your question..."
        style={{ width: '100%', marginTop: 10 }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={listen} disabled={listening} style={{ marginRight: 10 }}>
          🎤 Start Talking
        </button>
        <button onClick={stop} style={{ marginRight: 10 }}>
          🛑 Stop
        </button>
        <button onClick={handleSubmit} disabled={loading}>
          🚀 Submit
        </button>
      </div>
    </div>
    
    </>
  );
}



export default TutorVoice;


