import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

export default function ChatModal({ herb, isOpen, onClose, colors = {} }) {
  const primaryGreen = colors.primaryGreen || "#4a7c59";
  const lightGrey = colors.lightGrey || "#f0f4f7";
  const goldTan = colors.goldTan || "#a87f4c";

  const [messages, setMessages] = useState([
    { from: "bot", text: `Hello! How can I assist you regarding ${herb.name}?` },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { from: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate API call to LLM backend
    setTimeout(() => {
      const botMessage = {
        from: "bot",
        text: `This is a simulated response about ${herb.name}.`,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b" style={{ backgroundColor: primaryGreen }}>
          <h2 className="text-lg font-bold text-white">{herb.name} Chat</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-64 overflow-y-auto bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.from === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex p-4 border-t bg-white">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 bg-green-600 text-white rounded-r-lg hover:bg-green-700"
          >
            <FaPaperPlane />
          </button>
        </div>
      </motion.div>
    </div>
  );
}