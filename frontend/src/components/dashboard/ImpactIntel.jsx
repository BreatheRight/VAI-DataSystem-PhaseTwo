import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, FileText, Play, Pause, RefreshCw, Copy, MessageSquare, BarChart3, PieChart } from 'lucide-react';

const ImpactAnalysis = () => {
  // --- STATE ---
  const [apiKey, setApiKey] = useState(""); // In a real app, this comes from env/context
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'grant', 'chat'
  const [chatQuery, setChatQuery] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const audioRef = useRef(null);

  // --- MOCK DATA (Simulating Firestore Fetch) ---
  const installationData = {
    name: "Breathing Pavilion",
    dates: "Spring 2026",
    metrics: {
      totalVisitors: 1450,
      surveysCompleted: 342,
      avgSentiment: 4.8, // out of 5
      topKeywords: ["Peaceful", "Inclusive", "Safe", "Vibrant"],
      demographics: {
        localResidents: "68%",
        firstTimeVisitors: "45%"
      }
    },
    qualitativeSnippets: [
      "I felt safe here for the first time in months.",
      "The colors made me stop and breathe.",
      "My kids loved the open space."
    ]
  };

  // --- GEMINI API HELPERS ---

  const callGeminiText = async (prompt) => {
    // In production, use your actual key or a backend proxy
    const key = apiKey || "";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return `Error: ${error.message}. (Please ensure a valid API Key is set).`;
    }
  };

  const callGeminiTTS = async (text) => {
    const key = apiKey || "";
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" } // Professional, warm voice
                }
              }
            }
          })
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const audioContent = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioContent) {
        // Decode Base64 (Basic implementation for browser support)
        const binaryString = window.atob(audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        // Create Blob (PCM/WAV handling might be needed for strict formats,
        // but 'audio/wav' usually plays nicely with modern browsers if containerized)
        // Note: The raw output is PCM, usually needs a WAV header added.
        // For this demo, we'll assume the browser can handle the raw stream or we wrap it.
        // *Simpler Fallback for Demo*: If raw PCM fails, we'd add a WAV header function.
        // For simplicity in this file, we return the base64 URI directly.
        return `data:audio/wav;base64,${audioContent}`;
      }
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  };

  // --- HANDLERS ---

  const handleGenerate = async () => {
    setLoading(true);
    let prompt = "";

    const dataContext = JSON.stringify(installationData);

    if (activeTab === 'summary') {
      prompt = `You are a data analyst for a non-profit. Analyze this JSON data for the art installation '${installationData.name}': ${dataContext}.
      Write a concise, 3-sentence executive summary focusing on community impact and sentiment. Use professional but emotive language.`;
    } else if (activeTab === 'grant') {
      prompt = `You are a grant writer. Using this data: ${dataContext}, write a compelling paragraph for a funding application.
      Argue that the installation successfully fostered community safety and engagement. Highlight the ${installationData.metrics.avgSentiment} sentiment score.`;
    }

    const text = await callGeminiText(prompt);
    setGeneratedReport(text);
    setLoading(false);

    // Reset audio when new text is generated
    if (audioRef.current) {
        audioRef.current.pause();
        setAudioUrl(null);
        setIsPlaying(false);
    }
  };

  const handleChat = async () => {
    if (!chatQuery) return;
    setLoading(true);
    const dataContext = JSON.stringify(installationData);
    const prompt = `Context: ${dataContext}. User Question: ${chatQuery}. Answer the user briefly based ONLY on the provided context.`;

    const text = await callGeminiText(prompt);
    setChatResponse(text);
    setLoading(false);
  };

  const handleSpeak = async () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setLoading(true);
    const url = await callGeminiTTS(generatedReport || "Please generate a report first.");
    if (url) {
      setAudioUrl(url);
      setLoading(false);
      // Small timeout to allow state update
      setTimeout(() => {
        if(audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
      }, 100);
    } else {
        setLoading(false);
    }
  };

  // --- RENDER ---

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen font-sans text-slate-800">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Impact Intelligence <Sparkles className="text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-slate-500 mt-1">AI-Powered Data Synthesis for {installationData.name}</p>
        </div>

        {/* API Key Input (For Demo Purposes) */}
        <div className="flex items-center gap-2">
            <input
                type="password"
                placeholder="Enter Gemini API Key"
                className="px-3 py-2 border rounded-md text-sm w-48 focus:ring-2 focus:ring-amber-500 outline-none"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <BarChart3 size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Avg Sentiment</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{installationData.metrics.avgSentiment}<span className="text-lg text-slate-400 font-normal">/5.0</span></div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <PieChart size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Total Visitors</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{installationData.metrics.totalVisitors.toLocaleString()}</div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <MessageSquare size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Top Keyword</span>
          </div>
          <div className="text-4xl font-bold text-amber-500">"{installationData.metrics.topKeywords[0]}"</div>
        </div>
      </div>

      {/* INTELLIGENCE MODULE */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

        {/* TABS */}
        <div className="flex border-b border-slate-100">
            <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'summary' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <FileText size={16} /> Executive Summary
            </button>
            <button
                onClick={() => setActiveTab('grant')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'grant' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <Sparkles size={14} /> Social Media Buzz Feed
            </button>
            <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <MessageSquare size={16} /> Ask the Data
            </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-8 min-h-[300px] flex flex-col">

            {activeTab !== 'chat' ? (
                <>
                    {/* Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-slate-500">
                            {activeTab === 'summary' ? "Generate a high-level overview for stakeholders." : "Draft a persuasive narrative for funding applications."}
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            {generatedReport ? "Regenerate" : "Get Summary"}
                        </button>
                    </div>

                    {/* Output Area */}
                    <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 relative group">
                        {loading && !generatedReport ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                <Sparkles className="animate-pulse text-amber-300" size={48} />
                                <span className="animate-pulse">Analyzing data patterns...</span>
                            </div>
                        ) : generatedReport ? (
                            <div className="prose text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {generatedReport}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                                <FileText size={32} className="opacity-20" />
                                <span>Repo</span>
                            </div>
                        )}
                    </div>

                    {/* Action Footer */}
                    {generatedReport && (
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => navigator.clipboard.writeText(generatedReport)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
                            >
                                <Copy size={14} /> Copy Text
                            </button>

                            <button
                                onClick={handleSpeak}
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors border ${isPlaying ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'}`}
                            >
                                {loading && !audioUrl ? <RefreshCw className="animate-spin" size={14} /> : isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                {isPlaying ? "Pause Narration" : "Listen (TTS)"}
                            </button>
                            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                        </div>
                    )}
                </>
            ) : (
                /* CHAT INTERFACE */
                <div className="flex flex-col h-full gap-4">
                    <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 overflow-y-auto">
                        {!chatResponse && !loading && (
                            <div className="text-center text-slate-400 mt-10">
                                <p>Ask questions like:</p>
                                <ul className="mt-2 text-sm italic">
                                    <li>"What are the top keywords?"</li>
                                    <li>"How many locals visited?"</li>
                                    <li>"Summarize the visitor feedback."</li>
                                </ul>
                            </div>
                        )}
                        {chatResponse && (
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 inline-block max-w-[90%]">
                                <p className="text-slate-700">{chatResponse}</p>
                            </div>
                        )}
                        {loading && (
                             <div className="flex items-center gap-2 text-slate-400 mt-4">
                                <Sparkles size={16} className="animate-spin" /> Thinking...
                             </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatQuery}
                            onChange={(e) => setChatQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                            placeholder="Ask a question about the data..."
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                        <button
                            onClick={handleChat}
                            disabled={loading || !chatQuery}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            Ask
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default ImpactAnalysis;
