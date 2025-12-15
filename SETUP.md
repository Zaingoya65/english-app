# 🚀 Quick Setup Guide

## Important: Get Your Free API Key First!

Before starting, you need a **free Hugging Face API key**:

1. Go to https://huggingface.co/join and sign up (free!)
2. Visit https://huggingface.co/settings/tokens
3. Click "New token" → Name it "chat-app" → Select "Read" → Generate
4. **Copy your token!**

## Setup Steps

### 1. Configure Server

Create a file `server/.env` with this content:

```env 
PORT=5000
HUGGINGFACE_API_KEY=paste_your_api_key_here
AI_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
CLIENT_URL=http://localhost:5173
```

**⚠️ Replace `paste_your_api_key_here` with your actual API key!**

### 2. Start Backend Server

```bash
cd server
npm start
```

Expected output:
```
🚀 Server running on http://localhost:5000
📡 CORS enabled for http://localhost:5173
```

### 3. Start Frontend (in another terminal)

```bash
cd client
npm run dev
```

### 4. Open Browser

Go to: **http://localhost:5173**

## How to Use

1. **Toggle Input Mode**: Switch between 🎤 Voice or 💬 Text
2. **Voice Mode**: Click microphone → Speak → AI responds (text + speech)
3. **Text Mode**: Type message → Send → AI responds (text + speech)
4. **Replay**: Click 🔊 on any AI message to hear it again

## Troubleshooting

**API Key Error?**
- Make sure `.env` file is in the `server` folder
- Restart the backend server after creating `.env`

**Model Loading Error?**
- Wait 30 seconds and try again (free tier models need to wake up)

**Microphone Not Working?**
- Allow microphone access in browser
- Use Chrome or Edge (best support)

## Need Help?

Check the full [README.md](../README.md) or [walkthrough.md](../.gemini/antigravity/brain/7b5f7223-add5-4c29-93f9-f4f37cf365e3/walkthrough.md) for detailed instructions!
