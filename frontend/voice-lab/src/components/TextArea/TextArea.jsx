import React, { useState } from 'react'
import './TextArea.css'
import ttsIcon from '../../assets/tts-icon.svg'
import cloneIcon from '../../assets/voice-clone.svg'
import downloadIcon from '../../assets/download.png'

const TextArea = ({ placeholder = "Type something..." }) => {
  const [text, setText] = useState("")
  const [mode, setMode] = useState("tts") // 'tts' or 'clone'
  const [language, setLanguage] = useState("a")
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setText(e.target.value)

  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter some text.")

    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: mode === "tts" ? "af_heart" : "clone", language })
      })
      const data = await res.json()
      if (data.status === "success") setAudioUrl(data.audio_url)
      else alert(data.message || "Error generating audio")
    } catch (err) {
      console.error(err)
      alert("Error calling TTS API")
    }
    setLoading(false)
  }

  return (
    <div className="text-area-container">
      {/* Choice Buttons */}
      <div className="choice-buttons">
        <div
          className={`btn ${mode === "tts" ? "active" : ""}`}
          onClick={() => setMode("tts")}
        >
          <img src={ttsIcon} alt="TTS" />
          <p>TEXT TO SPEECH</p>
        </div>
        <div
          className={`btn ${mode === "clone" ? "active" : ""}`}
          onClick={() => setMode("clone")}
        >
          <img src={cloneIcon} alt="Voice Clone" />
          <p>VOICE REPLICA</p>
        </div>
      </div>

      {/* Text Area */}
      <div className="area">
        <textarea
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={5}
          className="textarea"
        />

        {/* Buttons below textarea */}
        <div className="btn-below">
          {/* Language Selector */}
          <select
            className="btn"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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

          <div className="btn-right">
            {/* Play Button */}
            <button className="btn" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "PLAY"}
            </button>

            {/* Download Button */}
            {audioUrl && (
              <a href={audioUrl} download className="btn">
                <img src={downloadIcon} alt="Download" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Audio preview */}
      {audioUrl && (
        <audio src={audioUrl} controls autoPlay style={{ marginTop: "1rem" }} />
      )}
    </div>
  )
}

export default TextArea
