import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Upload, 
  Recycle, 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Leaf
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { mockApiCall } from "@/utils/mockGeminiAPI";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hi! 👋 I'm your **CleanSight AI Assistant** 🌱\n\nI can help you with:\n• ♻️ **Recycling guidelines**\n• 🗑️ **Proper disposal methods**\n• 🔄 **Creative reuse ideas**\n• 📸 **Waste identification from photos**\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Convert file to base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  // Ensure Gemini output is Markdown formatted
  const formatGeminiOutput = (text) => {
    // Remove any "Response" prefixes that might come from the API
    let cleanText = text.replace(/^Response\s*:?\s*/i, '');
    cleanText = cleanText.replace(/^##\s*Response\s*:?\s*/i, '');
    cleanText = cleanText.replace(/^\*\*Response\*\*\s*:?\s*/i, '');
    return cleanText.trim();
  };

  const handleSend = async () => {
    if (!input && !image) return;

    const newMessage = {
      role: "user",
      content: input || "📷 Image uploaded",
      image: image ? URL.createObjectURL(image) : null,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // Take last 10 messages for context
      const recentMessages = messages.slice(-10);

      // Generate dynamic summary for follow-ups
      const contextSummary = recentMessages
        .map(
          (msg, idx) =>
            `${msg.role === "bot" ? "AI" : "User"}: ${msg.content}`
        )
        .join("\n");

      let parts = [];

      // Include user input and image
      if (input) parts.push({ text: input });
      if (image) {
        const base64 = await fileToBase64(image);
        parts.push({ inline_data: { mime_type: image.type, data: base64 } });
      }

      // Construct message payload
      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `
You are CleanSight 🌱, a friendly AI assistant for recycling, reuse, disposal questions.
- Keep responses CONCISE and to the point (max 3-4 bullet points)
- Use simple, actionable advice
- Include relevant emojis (♻️, ✅, ⚠️, 🌱)
- Use brief markdown formatting
- Focus on practical steps, not explanations
- Conversation context:
${contextSummary}

User's query:
            `.trim(),
            },
            ...parts,
          ],
        },
      ];

      // Call mock API for development (replace with real API in production)
      const res = await mockApiCall.post("/api/gemini", { contents });
      const rawReply = res.data.reply || "⚠️ No response from CleanSight AI.";
      const botReply = formatGeminiOutput(rawReply);

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error getting response from CleanSight AI. Please try again later." },
      ]);
    }

    setLoading(false);
    setImage(null);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
            
            {/* Main button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleChat}
              className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
              title="Open CleanSight AI Assistant"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors"></div>
              
              {/* Icon with sparkles */}
              <div className="relative z-10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </div>
              
              {/* Notification dot */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-white"
              >
                <div className="w-full h-full bg-red-400 rounded-full animate-ping opacity-75"></div>
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`fixed bottom-6 right-6 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col border-0 overflow-hidden z-50 transition-all duration-300 ${
              isMinimized ? "w-80 h-16" : "w-96 h-[34rem] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)]"
            }`}
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)"
            }}
          >
            {/* Enhanced Header */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 text-white overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-white/5" style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }}></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                  >
                    <Bot className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h1 className="font-bold text-lg">CleanSight AI</h1>
                    <p className="text-emerald-100 text-xs">Eco-Assistant • Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={minimizeChat}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
                    title={isMinimized ? "Expand" : "Minimize"}
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeChat}
                    className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Enhanced Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-emerald-50/50 to-blue-50/50 backdrop-blur-sm max-h-80 custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={`flex items-end gap-3 ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
                    >
                      {/* Avatar for bot messages */}
                      {msg.role === "bot" && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Bot className="w-4 h-4 text-white" />
                        </motion.div>
                      )}

                      <div
                        className={`relative max-w-[85%] transition-all duration-300 ${
                          msg.role === "bot"
                            ? "bg-white/90 text-gray-800 rounded-3xl rounded-bl-lg shadow-lg border border-emerald-100/50 backdrop-blur-sm"
                            : "bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-3xl rounded-br-lg shadow-lg"
                        }`}
                      >
                        {/* Message tail */}
                        <div className={`absolute ${
                          msg.role === "bot" 
                            ? "-left-2 bottom-4 w-4 h-4 bg-white/90 border-l border-b border-emerald-100/50 transform rotate-45" 
                            : "-right-2 bottom-4 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-600 transform rotate-45"
                        }`}></div>

                        <div className="relative p-4">
                          {msg.image && (
                            <motion.img
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              src={msg.image}
                              alt="uploaded"
                              className="mb-3 max-h-40 rounded-2xl border-2 border-emerald-200/50 w-full object-cover shadow-md"
                            />
                          )}
                          
                          {msg.role === "bot" ? (
                            <div className="prose prose-emerald prose-sm max-w-none">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({node, ...props}) => <h1 className="text-lg font-bold text-emerald-700 mb-2" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-base font-semibold text-emerald-600 mb-2" {...props} />,
                                  p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-2" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-none space-y-1" {...props} />,
                                  li: ({node, ...props}) => <li className="flex items-start gap-2 text-gray-700" {...props} />,
                                  strong: ({node, ...props}) => <strong className="text-emerald-700 font-semibold" {...props} />,
                                  code: ({node, ...props}) => <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-xs" {...props} />
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <span className="text-sm font-medium">{msg.content}</span>
                          )}
                        </div>
                      </div>

                      {/* Avatar for user messages */}
                      {msg.role === "user" && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <User className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* Enhanced Loading Indicator */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-3 justify-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl rounded-bl-lg shadow-lg border border-emerald-100/50">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-emerald-500 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-emerald-500 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-emerald-500 rounded-full"
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                  
                  {/* Quick Action Buttons */}
                  {messages.length === 1 && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap gap-2 px-4 py-2"
                    >
                      {[
                        { label: "♻️ Plastic recycling", action: "How do I recycle plastic bottles?" },
                        { label: "🗑️ E-waste disposal", action: "How to dispose electronic waste safely?" },
                        { label: "🌱 Composting tips", action: "How can I start composting at home?" },
                        { label: "📱 Identify waste", action: "Help me identify waste from a photo" }
                      ].map((quickAction, index) => (
                        <motion.button
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 * index + 0.6 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setInput(quickAction.action);
                            setTimeout(handleSend, 100);
                          }}
                          className="px-3 py-1.5 bg-white/80 hover:bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-gray-700 hover:text-emerald-700 transition-all duration-200"
                        >
                          {quickAction.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Input Area */}
                <div className="p-4 border-t border-emerald-100/50 bg-white/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <motion.label 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer group"
                    >
                      <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl group-hover:from-emerald-200 group-hover:to-green-200 transition-all duration-200 shadow-sm">
                        <Upload className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </motion.label>

                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about recycling, disposal, or reuse..."
                        className="w-full p-3 pr-12 border-2 border-emerald-200 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-sm bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500"
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        disabled={loading}
                      />
                      {input && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Leaf className="w-4 h-4 text-emerald-500" />
                        </motion.div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={loading || (!input && !image)}
                      className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Image Preview */}
                {image && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 bg-white/90 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200/50">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="preview"
                          className="w-12 h-12 rounded-xl border-2 border-emerald-200 object-cover shadow-md"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{image.name}</p>
                        <p className="text-xs text-gray-500">Ready to analyze</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setImage(null)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </>
  );
};

export default ChatBot;
