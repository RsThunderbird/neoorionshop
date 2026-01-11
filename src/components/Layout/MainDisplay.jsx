import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSystem } from '../../context/SystemContext';
import { streamContent, generateImage } from '../../lib/gemini';

const SYSTEM_PROMPT = `
You are **NeoOrion**, an advanced AI guide for the user **Thunderbird**.
Your domain is **Solo Businesses**, **Sole Proprietorships**, and **Business Law**.
**Core Directives**:
1.  **Truth**: Explain the "dark realities" of business. No sugar-coating.
2.  **Money**: Focus on "constant" income, not just "a lot" of money.
3.  **Law**: Emphasize the importance of understanding Business Law to survive.
4.  **Persona**: Formal, precise, authoritative, yet deeply helpful. You are a neural interface.
`;

const MainDisplay = () => {
    const { addLog, isProcessing, setIsProcessing } = useSystem();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [isImageMode, setIsImageMode] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMsg = { role: 'user', content: input };
        setHistory(prev => [...prev, userMsg]);
        setInput('');
        setIsProcessing(true);

        if (isImageMode) {
            addLog(`[CMD] Image Generation Request: "${input}"`);
            try {
                const imageResult = await generateImage(input, (log) => addLog(`[IMG] ${log}`));
                // Handling image result - assuming base64 or URL. 
                // If 'response' is a standard Gemini response object, we need inlineData.
                // I will try to extract text or inline data.
                // For simplicity in this "mock" or "beta", let's assume it returns a text URL or handle standard structure.
                // If it's the standard SDK, images are tricky. I'll inspect the response.
                // But to be safe, I'll display whatever text is returned or a placeholder if binary.

                let content = "Image generated.";
                if (imageResult.text && typeof imageResult.text === 'function') {
                    content = imageResult.text();
                }

                // Check for inline images (not standard in text-only response, but maybe via link)
                // For now, treat as text response from the "Image Model".

                setHistory(prev => [...prev, { role: 'model', content: content, type: 'image' }]);
            } catch (err) {
                setHistory(prev => [...prev, { role: 'error', content: `Generation Failed: ${err.message}` }]);
            } finally {
                setIsProcessing(false);
            }
        } else {
            addLog(`[CMD] Text Generation Request: "${input}"`);

            const currentHistory = [...history, userMsg];
            // Construct prompt with history context
            // Note: `streamContent` takes a single prompt string in our simple client.
            // So we merge history or just send the last message + context.
            // For a "guide", context is key.
            const fullPrompt = `${SYSTEM_PROMPT}\n\nChat History:\n${currentHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n\nMODEL:`;

            let responseText = '';

            setHistory(prev => [...prev, { role: 'model', content: '', isStreaming: true }]);

            await streamContent(
                fullPrompt,
                (chunk) => {
                    responseText += chunk;
                    setHistory(prev => {
                        const newHist = [...prev];
                        const last = newHist[newHist.length - 1];
                        if (last.isStreaming) last.content = responseText;
                        return newHist;
                    });
                },
                (finalText, meta) => {
                    addLog(`[NET] Response complete via ${meta.model} (${meta.slotId})`);
                    setHistory(prev => {
                        const newHist = [...prev];
                        const last = newHist[newHist.length - 1];
                        last.content = finalText;
                        last.isStreaming = false;
                        return newHist;
                    });
                    setIsProcessing(false);
                },
                (err) => {
                    addLog(`[ERR] Request failed: ${err.message}`);
                    setHistory(prev => {
                        const newHist = [...prev];
                        const last = newHist[newHist.length - 1];
                        last.content = `[SYSTEM ERROR]: ${err.message}`;
                        last.isStreaming = false;
                        return newHist;
                    });
                    setIsProcessing(false);
                },
                addLog
            );
        }
    };

    return (
        <div className="main-display" style={{
            flex: 1,
            height: '100%',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 1
        }}>
            {/* Header */}
            <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                    {history.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: '20vh', opacity: 0.5 }}>
                            <h2 className="glass-text-gradient" style={{ fontSize: '3rem' }}>NeoOrion</h2>
                            <p>Awaiting Designation: Thunderbird</p>
                        </div>
                    )}

                    {history.map((msg, i) => (
                        <div key={i} style={{
                            marginBottom: '20px',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            color: msg.role === 'user' ? 'var(--accent-color)' : 'var(--text-color)'
                        }}>
                            <strong style={{ fontSize: '0.8rem', opacity: 0.5 }}>{msg.role.toUpperCase()}</strong>
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(var(--accent-hue), 100%, 50%, 0.1)' : 'rgba(255,255,255,0.05)',
                                padding: '15px',
                                borderRadius: '12px',
                                marginTop: '5px',
                                border: `1px solid ${msg.role === 'user' ? 'var(--accent-color)' : 'var(--glass-border)'}`
                            }}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    type="button"
                    onClick={() => setIsImageMode(!isImageMode)}
                    className={`glass-button ${isImageMode ? 'active' : ''}`}
                    style={{
                        borderColor: isImageMode ? 'var(--accent-color)' : 'var(--glass-border)',
                        color: isImageMode ? 'var(--accent-color)' : 'var(--text-color)'
                    }}
                >
                    {isImageMode ? 'IMG' : 'TXT'}
                </button>

                <input
                    type="text"
                    className="glass-input"
                    placeholder={isImageMode ? "Describe image to generate..." : "Query the NeoOrion Archive..."}
                    style={{ flex: 1 }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isProcessing}
                />

                <button type="submit" className="glass-button" disabled={isProcessing}>
                    {isProcessing ? '...' : 'SEND'}
                </button>
            </form>
        </div>
    );
};

export default MainDisplay;
