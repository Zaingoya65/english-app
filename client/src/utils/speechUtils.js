// Text-to-Speech utilities

class SpeechUtils {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
    }

    speak(text, options = {}) {
        // Cancel any ongoing speech
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice properties
        utterance.lang = options.lang || 'en-US';
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        // Select voice if available
        const voices = this.synthesis.getVoices();
        if (voices.length > 0) {
            let selectedVoice = null;

            // Try to match preferred voice URI
            if (options.voiceURI) {
                selectedVoice = voices.find(v => v.voiceURI === options.voiceURI);
            }

            // Fallback to English voice
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);

        return new Promise((resolve) => {
            utterance.onend = () => {
                this.currentUtterance = null;
                resolve();
            };
            utterance.onerror = (error) => {
                // console.error('Speech synthesis error:', error);
                this.currentUtterance = null;
                resolve();
            };
        });
    }

    stop() {
        if (this.synthesis.speaking || this.synthesis.pending) {
            this.synthesis.cancel();
        }
        this.currentUtterance = null;
    }

    pause() {
        if (this.synthesis.speaking) {
            this.synthesis.pause();
        }
    }

    resume() {
        if (this.synthesis.paused) {
            this.synthesis.resume();
        }
    }

    isSpeaking() {
        return this.synthesis.speaking;
    }

    getVoices() {
        return this.synthesis.getVoices();
    }
}

export default new SpeechUtils();
