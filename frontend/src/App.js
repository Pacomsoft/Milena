import React, { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("cargando...");

  useEffect(() => {
    fetch("/api/hello")
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(err => setMsg("error: " + err.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>SeiyaRPG (dev)</h1>
      <p>Backend dice: {msg}</p>
    </div>
  );
}

export default App;
