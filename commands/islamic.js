/**
 * 👑 AWAIS MAYO ULTRA-BOT - ISLAMIC PORTAL CORE
 * ⚡ Feature: Dynamic Quranic Ayah Fetcher with Arabic and English Translation Logs
 */

const axios = require('axios');

module.exports = async (sock, from, msg) => {
    try {
        // Visual reaction on command initialization
        await sock.sendMessage(from, { react: { text: '✨', key: msg.key } });

        const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;

        // Fetch Arabic text and English translation simultaneously using Promise.all
        const [arabicRes, englishRes] = await Promise.all([
            axios.get(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}`),
            axios.get(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/en.asad`)
        ]);

        if (arabicRes.data?.data && englishRes.data?.data) {
            const arabicData = arabicRes.data.data;
            const englishText = englishRes.data.data.text;

            // Premium Styled Message Output
            let islamicPayload = 
                `╭━━━〔 🕋 *𝗭𝗘𝗣𝗛𝗬𝗥 𝗜𝗦𝗟𝗔𝗠𝗜𝗖* 〕━━━╮\n\n` +
                `📖 *Surah:* ${arabicData.surah.englishName} (${arabicData.surah.name})\n` +
                `🔢 *Ayah In Surah:* ${arabicData.numberInSurah}\n` +
                `📍 *Juz:* ${arabicData.juz} | *Manzil:* ${arabicData.manzil}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `  ${arabicData.text}  \n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `🇬🇧 *English Translation:*\n_${englishText}_\n\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━╯`;

            await sock.sendMessage(from, { text: islamicPayload }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { react: { text: '⚠️', key: msg.key } });
            await sock.sendMessage(from, { text: "❌ *[SERVER BUSY]* Network packet drops detected. Cloud API is not responding." }, { quoted: msg });
        }
    } catch (e) {
        console.error('Islamic Core Error:', e.message);
        await sock.sendMessage(from, { react: { text: '❤️', key: msg.key } });
        
        // Premium looking fallback response if API fails
        let fallbackPayload = 
            `╭━━━〔 🕋 *𝗭𝗘𝗣𝗛𝗬𝗥 𝗜𝗦𝗟𝗔𝗠𝗜𝗖* 〕━━━╮\n\n` +
            `📖 *Surah:* Ash-Sharh (الشرح)\n` +
            `🔢 *Ayah:* 5-6\n\n` +
            `فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا\n\n` +
            `🇬🇧 *Translation:* _"For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease."_\n\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯`;
            
        await sock.sendMessage(from, { text: fallbackPayload }, { quoted: msg });
    }
};
