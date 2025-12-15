import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStop, faCog, faComments, faPlane, faBriefcase, faCoffee, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import ChatWindow from "./components/ChatWindow";
import SpeechButton from "./components/SpeechButton";
import MessageInput from "./components/MessageInput";
import InputToggle from "./components/InputToggle";
import SettingsModal from "./components/SettingsModal";
import ReportModal from "./components/ReportModal"; // Imported ReportModal
import chatService from "./services/chatService";
import speechUtils from "./utils/speechUtils";


function App() {
  const [messages, setMessages] = useState([]);
  const [inputMode, setInputMode] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false); // State for Report Modal
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Settings & Context State
  const [settings, setSettings] = useState({
    voiceURI: '',
    grammarMode: false
  });
  const [currentTopic, setCurrentTopic] = useState('');

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text, timestamp: new Date() }]);
  };

  const handleSendMessage = async (messageText) => {
    addMessage("user", messageText);
    setIsLoading(true);

    // Determine mode based on settings and context
    let mode = 'default';
    if (settings.grammarMode) {
      mode = 'grammar';
    } else if (currentTopic) {
      mode = 'roleplay';
    }

    const result = await chatService.sendMessage(messageText, {
      mode,
      topic: currentTopic
    });

    setIsLoading(false);

    if (result.success) {
      const aiResponse = result.data.response;
      addMessage("bot", aiResponse);

      handleSpeakMessage(aiResponse);
    } else {
      const errorMessage = result.error || "Sorry, I couldn't process your message.";
      addMessage("bot", errorMessage);

      handleSpeakMessage(errorMessage);
    }
  };

  const handleSpeakMessage = async (text) => {
    setIsAiSpeaking(true);
    await speechUtils.speak(text, { voiceURI: settings.voiceURI });
    setIsAiSpeaking(false);
  };

  const handleStopSpeaking = () => {
    speechUtils.stop();
    setIsAiSpeaking(false);
  };

  // Handler for End Session
  const handleEndSession = async () => {
    handleStopSpeaking();
    setIsReportOpen(true);
    setIsReportLoading(true);
    setReportData(null);

    const result = await chatService.generateReport();

    setIsReportLoading(false);
    if (result.success) {
      setReportData(result.report);
    } else {
      setReportData("Sorry, failed to generate report. Please try again.");
    }
  };

  const handleClearChat = () => {
    handleStopSpeaking();
    setMessages([]);
    setCurrentTopic(''); // Reset topic on clear
    chatService.clearHistory();
    chatService.resetSession();
  };

  const startTopic = (topic) => {
    setCurrentTopic(topic);
  };

  const TOPICS = [
    { id: 'travel', name: 'At the Airport', icon: faPlane, color: 'bg-blue-100 text-blue-600' },
    { id: 'job', name: 'Job Interview', icon: faBriefcase, color: 'bg-purple-100 text-purple-600' },
    { id: 'cafe', name: 'Ordering Coffee', icon: faCoffee, color: 'bg-orange-100 text-orange-600' },
    { id: 'casual', name: 'Small Talk', icon: faComments, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Modals */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={setSettings}
        />
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          report={reportData}
          isLoading={isReportLoading}
        />

        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">English Practice</h1>
                  <div className="flex gap-2">
                    {settings.grammarMode && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded border border-blue-400 whitespace-nowrap">
                        Grammar
                      </span>
                    )}
                    {currentTopic && !settings.grammarMode && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded border border-purple-400 whitespace-nowrap">
                        {currentTopic}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-100"
                  title="Settings"
                >
                  <FontAwesomeIcon icon={faCog} size="lg" />

                </button>

                {messages.length > 0 && (
                  <>
                    <button
                      onClick={handleEndSession}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
                    >
                      <FontAwesomeIcon icon={faFileAlt} />
                      <span className="hidden sm:inline">View Report</span>
                    </button>

                    <button
                      onClick={handleClearChat}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center px-2 py-4 sm:px-4 sm:py-6 relative min-h-0">
          <div className="w-full max-w-5xl flex-1 flex flex-col gap-4 min-h-0">

            {/* Welcome Message & Topics */}
            {messages.length === 0 && (
              <div className="space-y-8 py-2 animate-fadeIn flex-1 flex flex-col justify-center">
                <div className="text-center space-y-4">
                  <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-2 drop-shadow-sm" />
                  <h2 className="text-3xl font-bold text-gray-900">Welcome, Again!</h2>
                  <p className="text-gray-600 text-sm max-w-lg mx-auto">
                    Choose a topic below to start a roleplay, or just start typing for a casual chat.
                    Use <b>Settings</b> <FontAwesomeIcon icon={faCog} /> to change voice or enable Grammar Correction.
                  </p>
                </div>

                {/* Topic Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto w-full px-2">

                  {TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => startTopic(topic.name)}
                      className={`p-4 sm:p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all text-left group flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 ${currentTopic === topic.name ? 'ring-2 ring-blue-500 shadow-md' : ''
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center sm:mb-4 shrink-0 ${topic.color}`}>
                        <FontAwesomeIcon icon={topic.icon} size="sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs text-gray-900 mb-0.5 sm:mb-1 group-hover:text-blue-600 transition">
                          {topic.name}
                        </h3>
                        <p className="text-xs text-gray-500">Roleplay</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Window */}
            {messages.length > 0 && (
              <ChatWindow
                messages={messages}
                onSpeakMessage={handleSpeakMessage}
                isLoading={isLoading}
              />
            )}

            {/* Stop Speaking Button - Floating */}
            {isAiSpeaking && (
              <div className="fixed bottom-24 right-8 z-50 animate-bounce">
                <button
                  onClick={handleStopSpeaking}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faStop} className="animate-pulse" />
                  <span>Stop Speaking</span>
                </button>
              </div>
            )}

            {/* Input Controls */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky bottom-4 z-20">
              <InputToggle mode={inputMode} onModeChange={setInputMode} />

              <div className="mt-6 flex justify-center">
                {inputMode === "voice" ? (
                  <SpeechButton
                    onSendMessage={handleSendMessage}
                    disabled={isLoading || isAiSpeaking}
                  />
                ) : (
                  <MessageInput
                    onSendMessage={handleSendMessage}
                    disabled={isLoading || isAiSpeaking}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center py-2 text-gray-500 text-xs border-gray-200 bg-white">
        <p>All rights reserved © 2025 · Made for English learners ❤️</p>
        <p>Suggestions and feedback are welcome at <a href="mailto:zaingoya65@gmail.com">zaingoya65@gmail.com</a></p>
      </footer>
    </>
  );
}

export default App;
