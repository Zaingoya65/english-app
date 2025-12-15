import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function MessageInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
       <>
  <form onSubmit={handleSubmit} className="w-full px-2">
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        disabled={disabled}
        className="w-full px-3 py-3 text-sm sm:text-base
                   border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:bg-gray-100"
      />

      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="w-full sm:w-auto py-3 px-4
                   bg-blue-600 text-white rounded-lg
                   flex items-center justify-center gap-2
                   disabled:bg-gray-300"
      >
        <span>Send</span>
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  </form>
</>

    );
}

export default MessageInput;
