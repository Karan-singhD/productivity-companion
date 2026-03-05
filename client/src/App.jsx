import { useState } from "react";
// basic react app with an input for a task and a button to get advice
function App() {
  const [task, setTask] = useState("");
  const [advice, setAdvice] = useState("");

  const getAdvice = async () => {
  if (!task.trim()) return;

  setAdvice("Loading...");

  try {
    const res = await fetch("http://localhost:5000/api/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });

    const data = await res.json();
    setAdvice(data.advice.replace(/\*\*/g, ""));
  } catch (e) {
    setAdvice("Could not reach the server. Make sure backend is running.");
  }
};
// Basic UI for input and displaying advice
  return (
    <div style={{fontFamily:"Arial", padding:"40px"}}>
      <h1>Productivity Companion</h1>
      <p>Enter a task and get productivity advice.</p>

      <input
        type="text"
        placeholder="Enter a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{padding:"10px", width:"300px"}}
      />

      <br/><br/>
      // Formating and output for the advice test 
      <button onClick={getAdvice} style={{padding:"10px 20px"}}>
        Get Advice
      </button>

      {advice && (
        <div style={{marginTop:"20px"}}>
          <h3>Advice:</h3>
          <div style={{ whiteSpace: "pre-wrap" }}>
          {advice}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
