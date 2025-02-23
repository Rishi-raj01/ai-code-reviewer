/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);
  const[message,setMessages]=useState("")

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
        role: "developer", // Pass the role here
      });

      setReview(response.data);
    } catch (error) {
      setReview("Error fetching review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function writeCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
        role: "expert", // Pass the role here
      });

      setReview(response.data);
    } catch (error) {
      setReview("Error fetching review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function help() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/chat", {
        code,
        role: "therapist", // Pass the role here
      });
      setReview(response.data);
      setMessages((prev) => [...prev, { sender: "AI", text: response.data.reply }]);
    } catch (error) {
        console.error("Error chatting with AI:", error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              className="code-editor"
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: "1rem",
                height: "100%",
                width: "100%",
                overflow: "auto",
              }}
            />
            <div className="main-buttons">
              <button onClick={help} className="help">
                Therapist
              </button>
              <button onClick={writeCode} className="new-button">
                Solve
              </button>
              <button onClick={reviewCode} className="review">
                Review
              </button>
            </div>
          </div>
        </div>
        <div className="right">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
