import { useRef, useEffect } from "react";
import MessageList from "./MessageList";

function ChatWindow({ messages, onSpeakMessage, isLoading }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex-1 overflow-y-auto">
            <MessageList
                messages={messages}
                onSpeakMessage={onSpeakMessage}
                isLoading={isLoading}
            />
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatWindow;
