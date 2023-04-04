const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

let fetch;

(async () => {
  const module = await import('node-fetch');
  fetch = module.default;
})();


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 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`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.error(`Error fetching GPT response: ${response.statusText}`);
      res.status(response.status).json({ error: "Error fetching GPT response" });
      return;
    }

    const data = await response.json();
    res.json({ message: data.choices[0].text.trim() });
  } catch (error) {
    console.error(`Error fetching GPT response: ${error}`);
    res.status(500).json({ error: "Error fetching GPT response" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
