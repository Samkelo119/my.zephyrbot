// lib/apiKeys.js
// 👑 AWAIS CYBER — Centralized, hot-swappable API key store.
// Admin Panel reads/writes here. API keys come from the environment or
// the Admin Panel; no provider keys are embedded in the source.

const fs = require('fs-extra');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'api_keys.json');

const DEFAULTS = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    giphyApiKey: process.env.GIPHY_API_KEY || '',
    omdbApiKey: process.env.OMDB_API_KEY || '',
    memeApiKey: process.env.MEME_API_KEY || '',
    songApiKey: process.env.SONG_API_KEY || ''
};

let cache = null;

function load() {
    if (cache) return cache;
    fs.ensureDirSync(path.dirname(FILE));
    if (fs.existsSync(FILE)) {
        try {
            cache = { ...DEFAULTS, ...fs.readJsonSync(FILE) };
            return cache;
        } catch (e) { /* fall through to defaults */ }
    }
    cache = { ...DEFAULTS };
    return cache;
}

function getAll() {
    return { ...load() };
}

function get(key) {
    return load()[key];
}

// Any extra custom key/value pair the user wants to store (for
// commands not centrally wired here yet) also lands in the same file.
function set(key, value) {
    const data = load();
    data[key] = value;
    cache = data;
    fs.writeJsonSync(FILE, data);
    return { ...data };
}

function remove(key) {
    const data = load();
    delete data[key];
    cache = data;
    fs.writeJsonSync(FILE, data);
    return { ...data };
}

module.exports = { get, getAll, set, remove };
