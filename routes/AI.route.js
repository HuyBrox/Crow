import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as PlayHT from 'playht';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const router = express.Router();

const apiKeys = [
    { userId: process.env.PLAY_HT_USER_ID, apiKey: process.env.PLAY_HT_API_KEY },
    { userId: process.env.PLAY_HT_USER_ID_1, apiKey: process.env.PLAY_HT_API_KEY_1 },
    { userId: process.env.PLAY_HT_USER_ID_2, apiKey: process.env.PLAY_HT_API_KEY_2 },
    { userId: process.env.PLAY_HT_USER_ID_3, apiKey: process.env.PLAY_HT_API_KEY_3 },
    { userId: process.env.PLAY_HT_USER_ID_4, apiKey: process.env.PLAY_HT_API_KEY_4 },
    { userId: process.env.PLAY_HT_USER_ID_5, apiKey: process.env.PLAY_HT_API_KEY_5 },
    { userId: process.env.PLAY_HT_USER_ID_6, apiKey: process.env.PLAY_HT_API_KEY_6 },
];

let currentKeyIndex = 0;
function getNextApiKey() {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    return apiKeys[currentKeyIndex];
}

// Route API
router.post('/api/tts', requireAuth, async (req, res) => {
    const text = req.body.text?.trim() + "   " || 'Đã có lỗi xảy ra';

    let keyData = getNextApiKey();

    while (true) {
        try {
            PlayHT.init({
                userId: keyData.userId,
                apiKey: keyData.apiKey,
            });

            const stream = await PlayHT.stream(text, {
                voiceEngine: 'PlayDialog',
                voice: 'en-US-Briggs',
                outputFormat: 'mp3',
                voiceEngine: "Play3.0-mini"
            });

            const chunks = [];
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('end', () => {
                const audioBuffer = Buffer.concat(chunks);
                res.set('Content-Type', 'audio/mpeg');
                res.send(audioBuffer);

            });

            return;
        } catch (error) {
            if (error.statusCode === 429) {
                console.warn(`API Key ${keyData.userId} bị giới hạn, đổi key...`);
                keyData = getNextApiKey();
            } else {
                console.error('Lỗi TTS:', error);
                return res.status(500).send('Lỗi tạo TTS');
            }
        }
    }
});

// Khởi tạo Gemini API với API Key từ .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Route API
router.post('/AI-gen', requireAuth, async (req, res) => {
    try {
        const { question, outputLang = 'en' } = req.body; // Mặc định outputLang là 'en' (tiếng Anh)
        if (!question) {
            return res.status(400).json({ error: 'Câu hỏi không được cung cấp' });
        }
        console.log('Câu hỏi:', question);
        console.log('Ngôn ngữ đầu ra:', outputLang);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Tạo prompt tối ưu để chỉ nhận bản dịch
        const prompt = `Translate the following text into ${outputLang} and return only the translated text, nothing else:\n"${question}"`;

        const result = await model.generateContent(prompt);
        const generatedAnswer = result.response.text().trim(); // Loại bỏ khoảng trắng thừa

        return res.status(200).json({ answer: generatedAnswer });
    } catch (error) {
        console.error('Lỗi khi gọi Gemini API:', error.message);
        return res.status(500).send('Lỗi server: ' + error.message);
    }
});


export default router;
