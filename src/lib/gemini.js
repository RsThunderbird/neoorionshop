import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from './constants';

const clients = {};

// Lazy initialization of clients to prevent early handshake
const getClient = (key) => {
    if (!clients[key]) {
        clients[key] = new GoogleGenerativeAI(key);
    }
    return clients[key];
};

/**
 * Streams content from the available text models with failover.
 * @param {string} prompt 
 * @param {function} onChunk - Callback per chunk (text)
 * @param {function} onComplete - Callback on completion (full text, metadata)
 * @param {function} onError - Callback on final failure
 */
export const streamContent = async (prompt, onChunk, onComplete, onError, onLog) => {
    const slots = API_CONFIG.filter(c => c.type === 'text');

    for (const slot of slots) {
        try {
            if (onLog) onLog(`Attempting connection to ${slot.model} [${slot.id}]...`);

            const genAI = getClient(slot.key);
            const model = genAI.getGenerativeModel({ model: slot.model });

            const result = await model.generateContentStream(prompt);

            if (onLog) onLog(`Connection established. Streaming from ${slot.model}...`);

            let fullText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                onChunk(chunkText);
            }

            if (onLog) onLog(`Stream complete for ${slot.model}.`);
            onComplete(fullText, { model: slot.model, slotId: slot.id });
            return; // Success, exit loop
        } catch (err) {
            if (onLog) onLog(`Error with ${slot.model} [${slot.id}]: ${err.message}`);
            console.warn(`Failover from ${slot.id}:`, err);
            // Loop continues to next slot
        }
    }

    if (onLog) onLog(`CRITICAL: All models failed.`);
    onError(new Error("All text models failed."));
};

/**
 * Generates an image using the dedicated image model.
 * @param {string} prompt 
 */
export const generateImage = async (prompt, onLog) => {
    const slot = API_CONFIG.find(c => c.type === 'image');
    if (!slot) throw new Error("No image config found");

    try {
        if (onLog) onLog(`Connecting to Image Model: ${slot.model}...`);
        const genAI = getClient(slot.key);
        const model = genAI.getGenerativeModel({ model: slot.model });

        // Assuming standard generation flow for this specific model request
        const result = await model.generateContent(prompt);
        const response = await result.response;

        if (onLog) onLog(`Image generation complete.`);
        return response;
    } catch (err) {
        if (onLog) onLog(`Image generation failed: ${err.message}`);
        throw err;
    }
};
