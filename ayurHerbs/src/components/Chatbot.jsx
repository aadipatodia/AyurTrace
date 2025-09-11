import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  X, 
  Send, 
  Loader2,
  Sparkles,
  MessageSquare,
  User,
  Leaf
} from "lucide-react";

const Chatbot = ({ page, colors, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: "bot",
      text: "Hello! I'm your AI-powered herbal wellness assistant. I'm here to help you with anything related to herbs, wellness tips, or navigating our platform. What would you like to know?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getContextualResponse = (userInput, currentPage, role) => {
    const input = userInput.toLowerCase();
    
    const pageResponses = {
      "home": [
        "Welcome to your dashboard! I can help you navigate to different sections, explain features, or provide wellness tips.",
        "From here, you can access all major features. Would you like me to explain what each section offers?",
        "Your home dashboard shows personalized content based on your role. What would you like to explore?"
      ],
      "herb-form": [
        "I can guide you through adding herb information, explain required fields, or help with best practices for documentation.",
        "When adding herbs, make sure to include origin details, quality certifications, and any relevant health benefits.",
        "Need help with the herb submission process? I can walk you through each step."
      ],
      "healthy-lifestyle": [
        "I'm here to share wellness tips, herbal remedies, and lifestyle advice for natural health.",
        "Would you like personalized recommendations based on your interests, or general wellness guidance?",
        "I can suggest herbal teas, natural remedies, or lifestyle practices for better health."
      ],
      "customer": [
        "I can help you trace product origins, verify quality certifications, or explain supply chain information.",
        "Use the search feature to find specific products and view their complete journey from farm to shelf.",
        "Would you like help understanding quality certificates or tracing a specific product?"
      ],
      "processor": [
        "I can assist with batch processing workflows, quality control standards, or supply chain management.",
        "Need help with processing procedures, quality documentation, or regulatory compliance?",
        "I can guide you through batch creation, quality checks, and distribution tracking."
      ]
    };

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      const greetings = [
        `Hello! I'm excited to help you with your herbal wellness journey.`,
        `Hi there! Ready to explore the world of natural wellness?`,
        `Hey! I'm here to assist you with herbs, health tips, and platform navigation.`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (input.includes('help') || input.includes('assist') || input.includes('guide')) {
      return pageResponses[currentPage]?.[0] || "I'm here to help! What specific assistance do you need?";
    }

    if (input.includes('herb') || input.includes('plant') || input.includes('botanical')) {
      const herbResponses = [
        "I can share information about various herbs, their benefits, uses, and preparation methods. Which herb interests you?",
        "Herbs have amazing therapeutic properties! Are you looking for information about a specific herb or general herbal knowledge?",
        "From cultivation to consumption, I can guide you through all aspects of herbal wellness. What would you like to know?"
      ];
      return herbResponses[Math.floor(Math.random() * herbResponses.length)];
    }

    if (input.includes('health') || input.includes('wellness') || input.includes('benefit')) {
      const healthResponses = [
        "Natural wellness combines traditional wisdom with modern understanding. I can share evidence-based health tips and herbal remedies.",
        "Herbal wellness focuses on prevention and natural healing. Would you like specific health recommendations?",
        "I can provide guidance on herbal remedies, wellness practices, and natural health approaches. What's your focus area?"
      ];
      return healthResponses[Math.floor(Math.random() * healthResponses.length)];
    }

    if (input.includes('quality') || input.includes('safety') || input.includes('certification')) {
      return "Quality and safety are paramount in herbal products. I can explain our certification process, quality standards, and how to verify product authenticity.";
    }

    if (input.includes('trace') || input.includes('track') || input.includes('origin')) {
      return "Our traceability system tracks every product from farm to consumer. I can show you how to trace origins, verify authenticity, and understand supply chain information.";
    }

    const contextResponses = pageResponses[currentPage] || [
      "That's an interesting question! I'm designed to help with herbal wellness, platform navigation, and natural health guidance.",
      "I'd be happy to help you with that. Could you provide more details about what you're looking for?",
      "Great question! I can assist with herbs, wellness tips, platform features, or general health guidance."
    ];

    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const thinkingTime = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      const response = getContextualResponse(input.trim(), page, userRole);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const chatContainerVariants = {
    hidden: { 
      scale: 0.3, 
      opacity: 0, 
      originX: 1, 
      originY: 1, 
      x: 100, 
      y: 100 
    },
    visible: { 
      scale: 1, 
      opacity: 1, 
      x: 0, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      } 
    },
    exit: { 
      scale: 0.3, 
      opacity: 0, 
      transition: { duration: 0.2 } 
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300"
        style={{ 
          backgroundColor: colors.primaryGreen,
          boxShadow: `0 8px 32px ${colors.primaryGreen}40`
        }}
        whileHover={{ 
          scale: 1.1,
          rotate: 10,
          boxShadow: `0 12px 48px ${colors.primaryGreen}60`
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 1
        }}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="bot-icon"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <Bot className="text-2xl text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="absolute -top-1 -right-1 text-yellow-300 text-sm" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="close-icon"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.3 }}
              >
                <X className="text-2xl text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden border"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: `${colors.primaryGreen}30`,
              boxShadow: `0 25px 50px rgba(0,0,0,0.15)`
            }}
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="flex-shrink-0 p-6 rounded-t-2xl relative overflow-hidden"
              style={{ backgroundColor: colors.primaryGreen }}
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 opacity-20">
                <Leaf className="absolute top-2 right-2 text-4xl rotate-12" />
                <Sparkles className="absolute bottom-2 left-2 text-2xl" />
              </div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    <Bot className="text-white text-xl" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Herbal AI</h3>
                    <p className="text-white/80 text-sm">Your wellness companion</p>
                  </div>
                </div>
                <motion.button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 rounded-full hover:bg-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="text-white" size={20} />
                </motion.button>
              </div>
            </motion.div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                      <motion.div
                        className={`p-4 rounded-2xl shadow-sm ${
                          msg.sender === "user"
                            ? "rounded-br-md"
                            : "rounded-bl-md"
                        }`}
                        style={{
                          backgroundColor: msg.sender === "user" ? colors.primaryGreen : colors.lightGrey,
                          color: msg.sender === "user" ? "white" : colors.darkText,
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-2 ${
                          msg.sender === "user" ? "text-white/70" : "text-gray-500"
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </motion.div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-2 mr-2 ${
                      msg.sender === "user" ? "order-1" : "order-2"
                    }`} style={{
                      backgroundColor: msg.sender === "user" ? colors.goldTan : colors.secondaryGreen,
                      color: "white"
                    }}>
                      {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.secondaryGreen }}
                      >
                        <Bot size={16} className="text-white" />
                      </div>
                      <div 
                        className="px-4 py-3 rounded-2xl rounded-bl-md"
                        style={{ backgroundColor: colors.lightGrey }}
                      >
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: colors.primaryGreen }}
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>

            <motion.div 
              className="flex-shrink-0 p-4 border-t"
              style={{ borderColor: `${colors.primaryGreen}20` }}
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about herbs, wellness, or anything..."
                    className="w-full p-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-30"
                    style={{ 
                      backgroundColor: colors.lightGrey,
                      borderColor: `${colors.primaryGreen}40`,
                      color: colors.darkText
                    }}
                    disabled={isTyping}
                  />
                  <MessageSquare 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50"
                    style={{ color: colors.primaryGreen }}
                    size={18}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`p-3 rounded-xl font-bold text-white transition-all duration-200 ${
                    (!input.trim() || isTyping)
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:shadow-lg"
                  }`}
                  style={{ backgroundColor: colors.primaryGreen }}
                  whileHover={input.trim() && !isTyping ? { 
                    scale: 1.05,
                    boxShadow: `0 8px 25px ${colors.primaryGreen}40`
                  } : {}}
                  whileTap={input.trim() && !isTyping ? { scale: 0.95 } : {}}
                >
                  {isTyping ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
