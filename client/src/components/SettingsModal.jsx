import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faRobot, faBook } from '@fortawesome/free-solid-svg-icons';
import speechUtils from "../utils/speechUtils";

function SettingsModal({ isOpen, onClose, settings, onSave }) {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(settings.voiceURI || "");
    const [grammarMode, setGrammarMode] = useState(settings.grammarMode || false);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechUtils.getVoices();
            // Filter for English voices primarily, but allow others
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
            setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);

            // Set default voice if none selected
            if (!selectedVoice && englishVoices.length > 0) {
                setSelectedVoice(englishVoices[0].voiceURI);
            }
        };

        loadVoices();

        // Voices might load async
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleSave = () => {
        onSave({
            voiceURI: selectedVoice,
            grammarMode: grammarMode
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Voice Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faRobot} className="mr-2" />
                            AI Voice
                        </label>
                        <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            {voices.map((voice) => (
                                <option key={voice.voiceURI} value={voice.voiceURI}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Select your preferred accent/gender.</p>
                    </div>

                    {/* Grammar Correction Toggle */}
                    <div>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-3 ${grammarMode ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <FontAwesomeIcon icon={faBook} />
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold text-gray-700">Grammar Correction Mode</span>
                                    <span className="block text-xs text-gray-500">AI will explicitly correct your mistakes</span>
                                </div>
                            </div>
                            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${grammarMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                                onClick={() => setGrammarMode(!grammarMode)}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${grammarMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faCheck} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
