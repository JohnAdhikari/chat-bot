import { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Body from "./components/body/Body";
import Footer from "./components/footer/Footer";

function App() {
  const [activeModel, setActiveModel] = useState("gemini-2.0-flash");
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("zone_ai_custom_key") || envKey);
  const [theme, setTheme] = useState(() => localStorage.getItem("zone_ai_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zone_ai_theme", theme);
  }, [theme]);

  function handleSaveKey(key) {
    setApiKey(key);
    localStorage.setItem("zone_ai_custom_key", key);
  }

  function handleToggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className="app-shell">
      <Header
        activeModel={activeModel}
        setActiveModel={setActiveModel}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <Body
        activeModel={activeModel}
        apiKey={apiKey}
      />
      <Footer />
    </div>
  );
}

export default App;