import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [advice, setAdvice] = useState("");

  const getAdvice = () => {
    if (!task) return;

    // Temporary placeholder AI response
    setAdvice(`To stay productive while "${task}", try working in focused 25 minute intervals with short breaks.`);
  };

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

      <button onClick={getAdvice} style={{padding:"10px 20px"}}>
        Get Advice
      </button>

      {advice && (
        <div style={{marginTop:"20px"}}>
          <h3>Advice:</h3>
          <p>{advice}</p>
        </div>
      )}
    </div>
  );
}

export default App;