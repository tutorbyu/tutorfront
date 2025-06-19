// src/components/Home.jsx
import React, { useState } from 'react';
import axios from 'axios';

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
      </div>
    </div>
  );
};

export default Home;
