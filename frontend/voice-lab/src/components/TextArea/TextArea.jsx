import React, { useState } from 'react';
import { Volume2, Copy, Download, Play, Loader } from 'lucide-react';
import './TextArea.css';
import voices from "../../assets/Voices"

const TextArea = ({ placeholder = "Type or paste your text here..." }) => {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("tts");
  const [language, setLanguage] = useState("a");
  const [voice, setVoice] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxChars = 5000;

  

  const handleChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxChars) {
      setText(newText);
      setCharCount(newText.length);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter some text.");
    if (!voice) return alert("Please select a voice.");

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, language })
      });
      const data = await res.json();
      if (data.status === "success") setAudioUrl(data.audio_url);
      else alert(data.message || "Error generating audio");
    } catch (err) {
      console.error(err);
      alert("Error calling TTS API");
    }
    setLoading(false);
  };

  const filteredVoices = voices.filter(v => v.language === language);

  return (
    <div className="text-area-container">
      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === "tts" ? "active" : ""}`}
          onClick={() => setMode("tts")}
        >
          <Volume2 size={20} />
          <span>Text to Speech</span>
        </button>
        <button
          className={`mode-btn ${mode === "clone" ? "active" : ""}`}
          onClick={() => setMode("clone")}
        >
          <Copy size={20} />
          <span>Voice Replica</span>
        </button>
      </div>

      {/* Main Input Area */}
      <div className="input-wrapper">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          className="textarea"
        />
        
        {/* Character Counter */}
        <div className="char-counter">
          <span className={charCount > maxChars * 0.9 ? "warning" : ""}>
            {charCount} / {maxChars}
          </span>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="controls-grid">
        {/* Language Select */}
        <div className="select-wrapper">
          <label className="label">Language</label>
          <select
            className="select"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setVoice("");
            }}
          >
            <option value="a">English (US)</option>
            <option value="b">English (UK)</option>
            <option value="f">French</option>
            <option value="e">Spanish</option>
            <option value="i">Italian</option>
            <option value="h">Hindi</option>
            <option value="j">Japanese</option>
            <option value="p">Portuguese</option>
            <option value="z">Mandarin</option>
          </select>
        </div>

        {/* Voice Select */}
        <div className="select-wrapper">
          <label className="label">Voice</label>
          <select
            className="select"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            <option value="">Select a voice</option>
            {filteredVoices.map(v => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.gender})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className={`generate-btn ${loading ? "loading" : ""}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={20} className="spinner" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Generate</span>
              </>
            )}
          </button>
          
          {audioUrl && (
            <a href={audioUrl} download className="download-btn">
              <Download size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Audio Preview */}
      {audioUrl && (
        <div className="audio-wrapper">
          <audio controls className="audio">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextArea;