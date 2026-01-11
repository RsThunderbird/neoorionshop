import React, { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
    const [hue, setHue] = useState(170);
    const [sat, setSat] = useState(100);
    const [light, setLight] = useState(50);

    // Update CSS variables
    useEffect(() => {
        document.documentElement.style.setProperty('--accent-hue', hue);
        document.documentElement.style.setProperty('--accent-sat', `${sat}%`);
        document.documentElement.style.setProperty('--accent-light', `${light}%`);
    }, [hue, sat, light]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>System Config</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem' }}>CHROMA TUNER</h3>

                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: `conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)`,
                        margin: '0 auto 20px auto',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: `0 0 30px var(--accent-color)`
                    }}
                        onClick={(e) => {
                            // Simple interaction: calc angle from center
                            const rect = e.target.getBoundingClientRect();
                            const x = e.clientX - rect.left - 75;
                            const y = e.clientY - rect.top - 75;
                            let angle = Math.atan2(y, x) * (180 / Math.PI);
                            if (angle < 0) angle += 360;
                            setHue(Math.round(angle) + 90); // +90 offset to align with CSS hue wheel if needed, actually 0 is usually red
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            width: '100%', height: '2px',
                            background: 'transparent', // Rotate this stick
                            transform: `translate(-50%, -50%) rotate(${hue}deg)`,
                            pointerEvents: 'none'
                        }}>
                            <div style={{
                                position: 'absolute',
                                right: '10px',
                                width: '10px', height: '10px',
                                background: '#fff',
                                borderRadius: '50%',
                                boxShadow: '0 0 5px black'
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', width: '30px' }}>HUE</span>
                        <input type="range" min="0" max="360" value={hue} onChange={e => setHue(e.target.value)} className="glass-slider" />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', width: '30px' }}>SAT</span>
                        <input type="range" min="0" max="100" value={sat} onChange={e => setSat(e.target.value)} className="glass-slider" />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', width: '30px' }}>LIT</span>
                        <input type="range" min="0" max="100" value={light} onChange={e => setLight(e.target.value)} className="glass-slider" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
