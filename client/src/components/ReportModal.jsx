import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload, faStar } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

function ReportModal({ isOpen, onClose, report, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-2">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 p-2 rounded-lg text-white">
                            <FontAwesomeIcon icon={faStar} size="lg" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Session Report Card</h2>
                            <p className="text-sm text-gray-500">Here's how you did!</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 text-gray-700 leading-relaxed font-sans">
                    {isLoading ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="animate-spin text-4xl text-blue-500">⏳</div>
                            <p className="text-lg text-gray-600 font-medium">Analyzing your conversation...</p>
                            <p className="text-sm text-gray-400">Generating expert feedback tailored to you.</p>
                        </div>
                    ) : report ? (
                        <div className="prose prose-blue max-w-none">
                            {/* Simple Markdown Rendering */}
                            <div className="whitespace-pre-wrap font-medium">
                                {report}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>No report available. Try chatting a bit more first!</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition"
                    >
                        Close
                    </button>
                    {!isLoading && report && (
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            Save Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReportModal;
