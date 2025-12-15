# 🎙️ English Speaking Chat App

A dual-functionality chat application for English language practice with AI. Practice English through **voice** or **text** input, and get AI responses both as **text** and **speech**!

## ✨ Features

- 🎤 **Voice Input**: Speak naturally using browser speech recognition
- 💬 **Text Input**: Type messages like a traditional chat app
- 🤖 **AI Responses**: Powered by open-source Groq models (Llama 3.3)
- 🧠 **Grammar Correction**: Specialized mode to catch and correct your mistakes
- 🎭 **Roleplay Scenarios**: Practice real-life conversations (Airport, Job Interview, Cafe, or Normal)
- 🗣️ **Voice Selection**: Choose from different accents and voices for the AI
- 🔊 **Text-to-Speech**: AI responses are automatically spoken

- 🔄 **Dual Functionality**: Switch between voice and text modes seamlessly
- 💾 **Conversation History**: Maintains context across messages
- 📊 **Conversation Reports**: Generate detailed PDF-like reports of your session with feedback

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)

- A Groq API key (for AI features)



### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies (if not already installed)
cd ../client
npm install
```

### 3. Configure Environment Variables

In the `server` folder, there's a `.env.example` file. Copy it to create your `.env`:

```bash
cd server
```

Then create a `.env` file with this content:

```env
PORT=5000
GROQ_API_KEY=your_actual_api_key_here
AI_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
CLIENT_URL=http://localhost:5173
```

**Replace `your_actual_api_key_here` with the API key you got from Groq!**

### 4. Start the Application

You need to run both the backend and frontend:

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Client:**
```bash
cd client
npm run dev
```

### 5. Open the App

Open your browser and go to: **http://localhost:5173**

## 🎮 How to Use

1. **Choose Input Mode**: Toggle between 🎤 Voice or 💬 Text using the switch
2. **Select Features**:
   - **Grammar Mode**: Toggle in settings to get instant corrections on your English.
   - **Roleplay**: Select a topic (Airport, Cafe, etc.) to start a guided conversation.
   - **Voice Settings**: Change the AI's speed and voice accent in settings.
3. **Send Messages**:
   - **Voice Mode**: Click "Start Speaking" and talk
   - **Text Mode**: Type your message and press Enter or click Send
3. **Listen to Responses**: AI responses are automatically spoken aloud
4. **Replay Messages**: Click the 🔊 icon next to any AI message to hear it again
5. **Generate Report**: Click "View Report" to get a detailed analysis of your speaking performance.
6. **Clear History**: Click "Clear Chat History" to start fresh

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Web Speech API (built-in browser)
- Axios

### Backend
- Node.js
- Express.js
- Groq Cloud API (Llama 3.3)
- CORS & Rate Limiting

### AI Model
- Meta Llama 3.3 70B Versatile (default)
- Other options: Mistral 7B, Falcon 7B

## 🔧 Alternative AI Models

You can change the AI model in your `.env` file:

```env
# Option 1: Meta Llama (recommended - best quality)
AI_MODEL=meta-llama/Meta-Llama-3-8B-Instruct

# Option 2: Mistral (good balance)
AI_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Option 3: Falcon (faster)
AI_MODEL=tiiuae/falcon-7b-instruct
```

## 🐛 Troubleshooting

### "API key not configured" error
- Make sure you created the `.env` file in the `server` folder
- Check that `Groq_API_KEY` is set correctly
- Restart the server after changing `.env`

### "Model is loading" error
- Wait 20-30 seconds and try again
- Free tier models may need time to "wake up"

### Microphone not working
- Make sure your browser has microphone permission
- Use Chrome or Edge for best speech recognition

### No AI responses
- Check that the backend server is running on port 5000
- Look for errors in the server terminal

## 📄 License

MIT

## 🤝 Contributing

Feel free to fork, improve, and submit pull requests!

---

**Made with ❤️ for English language learners**
