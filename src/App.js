import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate URL function
  const isValidUrl = (inputUrl) => {
    try {
      new URL(inputUrl);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to call the API
  const summarizeArticle = async () => {
    if (!url || !isValidUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setError(""); // Clear errors
      setSummary(""); // Reset summary
      setLoading(true); // Show loading spinner

      const response = await fetch(
        "https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=" +
          encodeURIComponent(url) +
          "&length=3",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "4ce8cbc9famshe201ae08f7b3b25p11de04jsn08d96a35f629", // Replace with your API Key
            "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summary || "No summary available.");
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch summary. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="App">
      <h1>📰 Article Summarizer</h1>

      {/* Input field for URL */}
      <input
        type="url"
        className="App-input"
        placeholder="Enter the URL of the article"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />

      {/* Summarize Button */}
      <button className="App-button" onClick={summarizeArticle} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {/* Error Message */}
      {error && <p className="App-error">{error}</p>}

      {/* Loader animation */}
      {loading && <div className="spinner"></div>}

      {/* Display Summary */}
      {summary && (
        <div className="App-summary">
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
