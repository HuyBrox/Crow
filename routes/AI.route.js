import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as PlayHT from 'playht';
import dotenv from 'dotenv';

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

export default router;
