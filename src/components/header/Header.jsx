import { useState } from "react";
import "./header.css";

function Header({ activeModel, setActiveModel, apiKey, onSaveKey, theme, onToggleTheme }) {
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  function handleSave(e) {
    e.preventDefault();
    onSaveKey(tempKey.trim());
    setShowSettings(false);
  }

  return (
    <>
      <header className="header-container glass-card">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/>
              <path d="M16 14a4 4 0 0 1-8 0"/>
              <path d="M12 18v4"/>
              <path d="M8 22h8"/>
            </svg>
          </div>
          <div className="brand-titles">
            <h2 className="brand-name">Zone <span className="brand-highlight">AI</span></h2>
            <span className="brand-status">Online Assistant</span>
          </div>
        </div>

        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <select
            className="model-select"
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
          >
            <option value="gemini-2.0-flash">⚡ Gemini 2.0 Flash</option>
            <option value="gpt-4o-mini">✨ GPT-4o Mini</option>
          </select>

          <button
            className={`settings-btn ${apiKey ? 'has-key' : ''}`}
            onClick={() => setShowSettings(true)}
            title="API Key Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>API Key Settings</h3>
              <button className="modal-close" onClick={() => setShowSettings(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="modal-desc">
              Your API key is stored <strong>only in local browser storage</strong> and is never sent to any server or database.
            </p>

            <form onSubmit={handleSave} className="modal-form">
              <div className="input-group">
                <label htmlFor="api-key-input">Gemini / OpenAI API Key</label>
                <input
                  id="api-key-input"
                  type="password"
                  placeholder="Paste your API key here..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowSettings(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;