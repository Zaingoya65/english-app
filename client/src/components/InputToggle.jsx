import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faMicrophone } from '@fortawesome/free-solid-svg-icons';

function InputToggle({ mode, onModeChange }) {
    return (
        <div className="flex items-center justify-center">
            <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
                <button
                    onClick={() => onModeChange("text")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all ${mode === "text"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <FontAwesomeIcon icon={faKeyboard} />
                    <span>Text</span>
                </button>
                <button
                    onClick={() => onModeChange("voice")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all ${mode === "voice"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <FontAwesomeIcon icon={faMicrophone} />
                    <span>Voice</span>
                </button>
            </div>
        </div>
    );
}

export default InputToggle;
