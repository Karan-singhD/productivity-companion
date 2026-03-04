import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/advice", (req, res) => {
  const { task } = req.body;

  res.json({
    advice: `Try breaking "${task}" into smaller steps and focus on one step at a time.`
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});