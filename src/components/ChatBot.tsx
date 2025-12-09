"use client";
import { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botMsg = { sender: "bot", text: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, botMsg]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Chat
      </button>

      {/* Chat window */}
      {open && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col mt-3">
          <div className="bg-blue-600 text-white p-3 rounded-t-xl text-center">
            Lianamed Assistant
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-black"
                    : "bg-blue-600 text-white ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full border rounded px-2 py-1"
              placeholder="Type a message..."
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
