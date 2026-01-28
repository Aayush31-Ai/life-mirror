/**
 * HealthAssistant Component - Friendly AI Health Companion
 */

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  Heart,
  Sparkles,
  Loader2,
  User,
  CheckCircle2,
} from "lucide-react";
import { generateAIReflection } from "../services/geminiService";

const Companion = ({ healthState, lifeMoments = [], currentTwin }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm your friendly health companion. I'm here to help you understand your health better, answer your questions, and support you on your journey. What would you like to know about your health today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change (WhatsApp effect)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickQuestions = [
    { icon: Heart, text: "How is my health trending?", color: "text-red-500" },
    { icon: Sparkles, text: "What should I focus on today?", color: "text-purple-500" },
    { icon: CheckCircle2, text: "Am I making progress?", color: "text-green-500" },
    { icon: MessageCircle, text: "Tips for better sleep?", color: "text-blue-500" },
  ];

  const handleSendMessage = async (message = userInput) => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      // Always call AI API - no caching
      const userContext = {
        currentHealth: {
          energy: healthState?.energy || 50,
          glucoseStress: healthState?.glucoseStress || 50,
          stress: healthState?.stressLevel || 50,
          adherence: healthState?.adherenceMomentum || 50,
          insulin: healthState?.insulinWorkload || 50,
        },
        recentActivity: lifeMoments.slice(0, 10).map(m => ({
          type: m.type,
          intensity: m.intensity,
          description: m.description,
          date: new Date(m.timestamp || m.date).toLocaleDateString(),
        })),
        twinMetrics: currentTwin ? {
          energy: currentTwin.energy,
          stress: currentTwin.stressLevel,
          adherence: currentTwin.adherenceMomentum,
        } : null,
        totalMoments: lifeMoments.length,
        conversationHistory: messages.slice(-3).map(m => ({
          role: m.role,
          content: m.content,
        })),
      };

      const contextualPrompt = `User Question: ${message}

User Health Context:
- Current Energy Level: ${userContext.currentHealth.energy}/100
- Stress Level: ${userContext.currentHealth.stress}/100
- Glucose Management: ${userContext.currentHealth.glucoseStress}/100
- Health Adherence: ${userContext.currentHealth.adherence}/100
- Total Health Moments Logged: ${userContext.totalMoments}

Recent Activity (Last 10 moments):
${userContext.recentActivity.length > 0 
  ? userContext.recentActivity.map(m => `- ${m.date}: ${m.type} (${m.intensity}) - ${m.description}`).join('\n')
  : '- No recent activity logged yet'}

Previous Conversation (Last 3 messages):
${userContext.conversationHistory.length > 0
  ? userContext.conversationHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
  : '- No previous conversation'}

Please provide a friendly, personalized, and supportive response that:
1. Acknowledges their current health state
2. References previous conversation context when relevant
3. Provides actionable advice based on their context
4. Encourages continued progress
5. Is warm and conversational`;

      const aiResponse = await generateAIReflection({
        moment: { type: "health-question", description: message },
        impact: userContext.currentHealth,
        organ: "General",
        healthState: healthState || {},
        nudgeType: "informative",
        dayMoments: lifeMoments.slice(0, 10),
        scenario: contextualPrompt,
        currentTwin: currentTwin || null,
        whatIfTwin: null,
      });

      const assistantMessage = {
        role: "assistant",
        content: aiResponse.momentNarrative || aiResponse.nudge || 
          "I'm here to help! Based on your health journey, I'd suggest focusing on consistency and small, sustainable changes. Every positive step counts!",
        timestamp: new Date().toISOString(),
        source: "ai",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI response error:", error);
      const fallbackMessage = {
        role: "assistant",
        content: "I'm having a moment of reflection! 🤔 But here's what I can tell you: your health journey is unique, and every small positive action you take matters. Keep going!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
  <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">

    {/* HEADER */}
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-health-blue to-purple-500 text-white">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Health Companion</h3>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Reflecting on your health
          </p>
        </div>
      </div>

      <span className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3" />
        Active
      </span>
    </div>

    {/* MESSAGES */}
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 bg-gray-50">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-end gap-3 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {/* Avatar */}
          {message.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Bubble */}
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl leading-relaxed text-sm ${
              message.role === "user"
                ? "bg-health-blue text-white rounded-br-sm"
                : "bg-white text-gray-800 shadow rounded-bl-sm"
            }`}
          >
            <p>{message.content}</p>
            <div className="mt-2 text-[10px] opacity-70 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {message.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-health-blue flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ))}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="px-4 py-3 bg-white rounded-2xl shadow flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-health-blue" />
            <span className="text-xs text-gray-500">
              Thinking…
            </span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {/* QUICK QUESTIONS */}
    {messages.length === 1 && (
      <div className="px-6 py-3 border-t bg-white">
        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Quick prompts
        </p>

        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, index) => {
            const Icon = q.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickQuestion(q.text)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-xs transition"
              >
                <Icon className={`w-4 h-4 ${q.color}`} />
                {q.text}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* INPUT */}
    <div className="px-6 py-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your health companion..."
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-health-blue outline-none text-sm"
          disabled={isLoading}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!userInput.trim() || isLoading}
          className="w-11 h-11 rounded-full bg-health-blue text-white flex items-center justify-center hover:bg-blue-600 transition disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
        <Heart className="w-3 h-3 text-red-400" />
        Gentle guidance, not medical advice
      </p>
    </div>
  </div>
);

};

export default Companion;
