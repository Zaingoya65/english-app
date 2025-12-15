import { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = speechRecognition ? new speechRecognition() : null;

if (recognition) {
    recognition.lang = "en-IN";
    recognition.continuous = false;
}

function SpeechButton({ onSendMessage, disabled }) {
    const [isListening, setIsListening] = useState(false);
    const isProcessing = useRef(false);

    const transcriptRef = useRef("");

    const startListening = () => {
        if (!recognition) {
            alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
            return;
        }

        try {
            recognition.abort();
        } catch (e) {
            // Ignore
        }

        // Configure for continuous listening
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;

        // Reset transcript
        transcriptRef.current = "";

        isProcessing.current = false;

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            // Reconstruct the full transcript from all results
            const currentTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');

            transcriptRef.current = currentTranscript;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            // Don't stop listening on 'no-speech' error, just ignore it
            if (event.error === 'no-speech') {
                return;
            }

            setIsListening(false);
            isProcessing.current = false;

            if (event.error === "not-allowed") {
                alert("Microphone access denied. Please allow microphone access to use voice input.");
            }
        };

        recognition.onend = () => {
            setIsListening(false);

            // Only send if we have text
            if (transcriptRef.current.trim()) {
                onSendMessage(transcriptRef.current.trim());
                transcriptRef.current = "";
            }

            setTimeout(() => {
                isProcessing.current = false;
            }, 500);
        };
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
        // State update happens in onend
    };

    return (
        <button
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-lg font-medium transition-all shadow-sm ${isListening
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                }`}
        >
            <FontAwesomeIcon icon={isListening ? faStop : faMicrophone} className="text-lg" />
            <span>{isListening ? "Stop Recording" : "Start Recording"}</span>
        </button>
    );
}

export default SpeechButton;
