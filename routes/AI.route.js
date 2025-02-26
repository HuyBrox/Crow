import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as PlayHT from 'playht';
import { franc } from 'franc';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Danh sách API keys để luân phiên sử dụng
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

// Hàm xác định ngôn ngữ bằng franc + kiểm tra ký tự Unicode
function detectLanguage(text) {
    let langCode = franc(text);

    // Nếu franc không nhận diện được
    if (langCode === 'und') {
        if (/[\u3040-\u30FF]/.test(text)) return 'jpn'; // Tiếng Nhật (Hiragana/Katakana)
        if (/[\u4E00-\u9FFF]/.test(text)) return 'zho'; // Tiếng Trung (Hán tự)
        if (/[\u0E00-\u0E7F]/.test(text)) return 'tha'; // Tiếng Thái
        if (/[\u0100-\u024F]/.test(text)) return 'vie'; // Tiếng Việt có dấu Latin
        return 'eng'; // Mặc định tiếng Anh nếu vẫn không xác định được
    }
    return langCode;
}

// Bản đồ ngôn ngữ với voice ID của PlayHT
const languageToVoiceMap = {
    'jpn': 'ja-JP-Haruto',
    'vie': 'vi-VN-Male1',
    'eng': 'en-US-Briggs',
    'zho': 'zh-CN-Yunxi', // Tiếng Trung
    'tha': 'th-TH-Prem',  // Tiếng Thái
};

// Route API
router.post('/api/tts', requireAuth, async (req, res) => {
    const text = req.body.text?.trim() || 'Đã có lỗi xảy ra';

    const langCode = detectLanguage(text);
    console.log(`Detected language: ${langCode}`);

    const voiceId = languageToVoiceMap[langCode] || 'en-US-Briggs'; // Mặc định tiếng Anh

    let keyData = getNextApiKey();

    while (true) {
        try {
            PlayHT.init({
                userId: keyData.userId,
                apiKey: keyData.apiKey,
            });

            const stream = await PlayHT.stream(text, {
                voiceEngine: 'PlayDialog',
                voice: voiceId,
                outputFormat: 'mp3',
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
