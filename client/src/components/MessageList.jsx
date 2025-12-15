import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

function MessageList({ messages, onSpeakMessage, isLoading }) {
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-4">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${msg.sender === "user"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                        {msg.sender === "user" ? "U" : "AI"}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col gap-1 max-w-[70%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        <div
                            className={`px-4 py-3 rounded-lg ${msg.sender === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-900"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>

                        {/* Footer with timestamp and speaker */}
                        <div className={`flex items-center gap-2 px-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                            {msg.sender === "bot" && (
                                <button
                                    onClick={() => onSpeakMessage(msg.text)}
                                    className="text-gray-500 hover:text-blue-600 transition"
                                    title="Play message"
                                >
                                    <FontAwesomeIcon icon={faVolumeUp} className="text-sm" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-sm">
                        AI
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageList;
