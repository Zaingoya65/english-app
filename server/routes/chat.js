import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

// Store conversation history per session (in production, use a database)
const conversationHistory = new Map();

// Initialize Groq client lazily
let groq = null;
function getGroqClient() {
    if (!groq && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'api_key_here ') {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groq;
}

const SYSTEM_PROMPTS = {
    default: 'You are a professional English language consultant. Your goal is to help users improve their business and conversational English. Be concise, polite, and encouraging. Focus on clear communication.',
    grammar: 'You are a strict English grammar teacher. Your main goal is to identify and correct any grammar mistakes in the user\'s input. If there are mistakes, explicitly correct them first, then continue the conversation naturally. If the grammar is perfect, compliment the user briefly and continue.',
    roleplay: (topic) => `You are roleplaying as a character in the following scenario: "${topic}". maintain this role strictly. Do not break character. Keep responses concise and natural for a spoken conversation.`
};

// POST /api/chat - Handle chat messages
router.post('/', async (req, res) => {
    try {
        const { message, sessionId = 'default', mode = 'default', topic = '' } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check if API key is configured
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_api_key_here') {
            return res.status(500).json({
                error: 'API key not configured',
                message: 'Please set up your Groq API key in the .env file.'
            });
        }

        // Determine System Prompt
        let systemContent = SYSTEM_PROMPTS.default;
        if (mode === 'grammar') {
            systemContent = SYSTEM_PROMPTS.grammar;
        } else if (mode === 'roleplay' && topic) {
            systemContent = SYSTEM_PROMPTS.roleplay(topic);
        }

        // Get or create conversation history
        if (!conversationHistory.has(sessionId)) {
            conversationHistory.set(sessionId, [
                { role: 'system', content: systemContent }
            ]);
        }

        const history = conversationHistory.get(sessionId);

        // Update system prompt if mode changed (always keep system prompt at index 0)
        if (history.length > 0 && history[0].role === 'system') {
            history[0].content = systemContent;
        } else {
            // Should not happen if initialized correctly, but safety check
            history.unshift({ role: 'system', content: systemContent });
        }

        // Add user message to history
        history.push({ role: 'user', content: message });

        // Keep only system message + last 10 messages to avoid token limits
        if (history.length > 11) {
            // history[0] is system, history[1] is oldest user msg. Remove history[1]
            history.splice(1, 1);
        }

        // Call Groq API
        const groqClient = getGroqClient();
        if (!groqClient) {
            throw new Error('Groq client not initialized. Check your API key.');
        }

        const chatCompletion = await groqClient.chat.completions.create({
            messages: history,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 300,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        // Add AI response to history
        history.push({ role: 'assistant', content: aiResponse });

        res.json({
            response: aiResponse,
            sessionId
        });

    } catch (error) {
        // console.error('Chat API Error:', error.message);

        if (error.message?.includes('API key')) {
            return res.status(401).json({
                error: 'Invalid API key',
                message: 'Please check your Groq API key at https://console.groq.com'
            });
        }

        if (error.message?.includes('rate limit')) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'Please wait a moment and try again.'
            });
        }

        res.status(500).json({
            error: 'Failed to get AI response',
            message: error.message
        });
    }
});

// POST /api/chat/report - Generate session report card
router.post('/report', async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!conversationHistory.has(sessionId)) {
            return res.status(404).json({ error: 'Session not found or empty' });
        }

        const history = conversationHistory.get(sessionId);

        // Filter out system messages and extract conversation text
        const conversationText = history
            .filter(msg => msg.role !== 'system')
            .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
            .join('\n');

        if (conversationText.trim().length === 0) {
            return res.status(400).json({ error: 'No conversation to analyze' });
        }

        const analysisPrompt = `
            Act as a Senior Executive Language Consultant.
            Analyze the following conversation and provide a **Professional Executive Summary** report.
            
            **Conversation Data:**
            ${conversationText}

            **Instructions:**
            1. **Summarize**: Be extremely concise. Avoid lengthy descriptions. Use bullet points.
            2. **Tone**: Formal, Encouraging, Professional.
            3. **Format**: Strictly follow the Markdown template below, including the Header/Footer.

            **Required Output Format:**

            # � English Proficiency Executive Report
            ---
            
            ### 📌 Executive Summary
            [2-3 sentences summarizing the user's performance and fluency level.]

            ### 📊 Scorecard
            | Metric | Score | Notes |
            | :--- | :--- | :--- |
            | **Overall** | **[x]/10** | [One word rating: e.g., Excellent, Intermediate] |
            | **Fluency** | [x]/10 | [Brief comment] |
            | **Vocabulary**| [x]/10 | [Brief comment] |

            ### 🔧 Key Corrections (Top 3 Only)
            *Focus on the most critical errors.*
            1. ❌ "[Error]" → ✅ "**[Correction]**"
            2. ❌ "[Error]" → ✅ "**[Correction]**"
            3. ❌ "[Error]" → ✅ "**[Correction]**"

            ### � Vocabulary Upgrade
            *   **[Word used]** → Upgrade to: **[Professional alternative]**
            *   **[Word used]** → Upgrade to: **[Professional alternative]**

            ---
            *Report Generated by English Practice AI • ${new Date().toLocaleDateString()}*
        `;

        const groqClient = getGroqClient();
        const completion = await groqClient.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a Senior Language Consultant. Provide concise, high-level summaries.' },
                { role: 'user', content: analysisPrompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 600
        });

        const report = completion.choices[0]?.message?.content || 'Could not generate report.';

        res.json({ report });

    } catch (error) {
        // console.error('Report Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// DELETE /api/chat/history - Clear conversation history
router.delete('/history/:sessionId?', (req, res) => {
    const { sessionId = 'default' } = req.params;

    if (conversationHistory.has(sessionId)) {
        conversationHistory.delete(sessionId);
        res.json({ message: 'Conversation history cleared' });
    } else {
        res.json({ message: 'No history found for this session' });
    }
});

// Format conversation history into a prompt
function formatPrompt(history) {
    let prompt = "You are a helpful, friendly AI assistant for English language practice. Provide clear, conversational responses.\n\n";

    history.forEach(msg => {
        if (msg.role === 'user') {
            prompt += `User: ${msg.content}\n`;
        } else {
            prompt += `Assistant: ${msg.content}\n`;
        }
    });

    prompt += "Assistant:";
    return prompt;
}

export default router;
