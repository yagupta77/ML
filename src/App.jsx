import React, { useEffect, useState } from 'react';
import * as webllm from "@mlc-ai/web-llm";
import "./app.scss";

import { useRef } from 'react';

function App() {
  const [engine, setEngine] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello, how can I help you?" }
  ]);
  const [model, setModel] = useState("TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC");
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const initEngine = async () => {
      try {
        const newEngine = await webllm.CreateMLCEngine(model, {
          initProgressCallback: (p) => console.log("Loading:", p)
        });

        if (mounted) {
          setEngine(newEngine);
          setLoading(false);
        }
      } catch (e) {
        console.error("Engine init error:", e);
        alert("Error initializing engine: " + e.message);
        setEngine(null);
        setLoading(false);
      }
    };

    initEngine();

    return () => {
      mounted = false;
    };
  }, [model]);

  async function sendMessageToLLM() {
    if (!engine) {
      alert("Engine is not ready yet.");
      return;
    }

    const tempMessages = [...messages, { role: "user", content: input }];
    setMessages(tempMessages);
    setInput("");
    if (inputRef.current) inputRef.current.focus();

    try {
      setReplying(true);
      // Use a strong system prompt and only the last user/assistant exchange
      const basePrompt = [
        { role: "system", content: "You are a helpful and friendly assistant. Always provide detailed, thoughtful, and welcoming responses, even to short greetings. If the user greets you, reply with a warm and elaborate welcome message and offer your help." }
      ];
      // Only keep the last user and assistant messages (excluding any system messages)
      const lastUserAndAssistant = tempMessages.filter(m => m.role !== 'system').slice(-2);
      const promptMessages = basePrompt.concat(lastUserAndAssistant);
      const reply = await engine.chat.completions.create({
        messages: promptMessages,
        max_tokens: 64, // Faster, shorter replies
        temperature: 0.7
      });
      if (reply?.choices?.[0]?.message) {
        setMessages([...tempMessages, reply.choices[0].message]);
      }
    } catch (e) {
      console.error("Chat error:", e);

      if (e?.message?.includes("Device was lost")) {
        alert("GPU device was lost. Reloading the page might help.");
      } else {
        alert("Unexpected error: " + e.message);
      }
    } finally {
      setReplying(false);
    }
  }

  const availableModels = [
    "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC",
    "RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC",
    "Phi-2-q4f32_1-MLC",
    "Mistral-7B-Instruct-v0.1-q4f32_1-MLC"
  ];

  // Auto-scroll to bottom on new message
  const conversationEndRef = useRef(null);
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, replying]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-title">MLC Web Chat</div>
        <div className="model-select">
          <label htmlFor="model">Model:</label>
          <select id="model" value={model} onChange={(e) => setModel(e.target.value)} disabled={loading}>
            {availableModels.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {loading && <span className="model-loading">Loading...</span>}
        </div>
      </header>
      <main className="chat-main">
        <div className="conversation-area">
          {messages.map((msg, i) => (
            <div key={i} className={`bubble-wrapper ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}>
              {msg.role === 'assistant' && (
                <div className="avatar ai-avatar" title="Ayed">
                  <span role="img" aria-label="AI">🤖</span>
                </div>
              )}
              <div className="bubble-label-and-content">
                <div className={`bubble-label ${msg.role === 'user' ? 'user-label' : 'ai-label'}`}>
                  {msg.role === 'user' ? 'Ami' : 'Ayed'}
                </div>
                <div
                  className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="avatar user-avatar" title="Ami">
                  <span role="img" aria-label="User">🧑</span>
                </div>
              )}
            </div>
          ))}
          {replying && (
            <div className="bubble assistant-bubble loading-bubble">
              <span className="dot-flashing"></span> Model is replying...
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>
        <form
          className="input-area"
          onSubmit={e => { e.preventDefault(); sendMessageToLLM(); }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!engine || loading || replying}
            autoComplete="off"
          />
          <button type="submit" disabled={!engine || !input.trim() || loading || replying}>
            Send
          </button>
        </form>
      </main>
      <footer className="chat-footer">
        &copy; {new Date().getFullYear()} MLC Web Chat. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
