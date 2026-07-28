import "./body.css";
import { useRef, useState, useEffect } from "react";

function Body({ activeModel, apiKey }) {
  const [inputField, setInputField] = useState("");
  const [chat, setChat] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function submitInput() {
    if (!inputField.trim() || isFetching) return;

    const userMessage = { sender: "user", text: inputField.trim() };
    setChat((prev) => [...prev, userMessage]);
    setInputField("");
    setIsFetching(true);

    try {
      const reply = await getAiResponse(inputField.trim());
      const aiMessage = { sender: "ai", text: reply };
      setChat((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage = { sender: "ai", text: "Sorry, I encountered an error. Please check your API key and try again." };
      setChat((prev) => [...prev, errorMessage]);
    } finally {
      setIsFetching(false);
    }
  }

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;

  async function getAiResponse(message) {
    const key = apiKey || localStorage.getItem("zone_ai_custom_key") || envKey;
    if (!key) {
      throw new Error("No API key");
    }

    if ("gemini" in (activeModel || "").toLowerCase() || key.startsWith("AIza")) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    }

    const url = "https://api.openai.com/v1/chat/completions";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response";
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey && !isFetching) {
      e.preventDefault();
      submitInput();
    }
  }

  return (
    <div className="body-container">
      <div className="chat-area">
        {chat.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/>
                <path d="M16 14a4 4 0 0 1-8 0"/>
                <path d="M12 18v4"/>
                <path d="M8 22h8"/>
              </svg>
            </div>
            <h2 className="welcome-title">How can I help you today?</h2>
            <p className="welcome-sub">
              Select a model from the top bar and start a conversation
            </p>
          </div>
        )}

        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === "user" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/>
                  <path d="M16 14a4 4 0 0 1-8 0"/>
                  <path d="M12 18v4"/>
                  <path d="M8 22h8"/>
                </svg>
              )}
            </div>
            <div className="message-bubble">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isFetching && (
          <div className="message ai">
            <div className="message-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/>
                <path d="M16 14a4 4 0 0 1-8 0"/>
                <path d="M12 18v4"/>
                <path d="M8 22h8"/>
              </svg>
            </div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <input
            type="text"
            className="user-input"
            value={inputField}
            onChange={(e) => setInputField(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={isFetching}
          />
          <button
            className="send-btn"
            onClick={submitInput}
            disabled={isFetching || !inputField.trim()}
          >
            {isFetching ? (
              <div className="spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
          </button>
        </div>
        {!apiKey && !localStorage.getItem("zone_ai_custom_key") && !envKey && (
          <p className="input-hint">
            Set your API key using the 🔑 button above
          </p>
        )}
        {!apiKey && !localStorage.getItem("zone_ai_custom_key") && envKey && (
          <p className="input-hint" style={{ color: 'var(--accent-emerald, #10b981)' }}>
            Using API key from .env file
          </p>
        )}
      </div>
    </div>
  );
}

export default Body;