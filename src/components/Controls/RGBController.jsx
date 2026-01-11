import React, { useState, useEffect } from 'react';

const RGBController = () => {
    const [hue, setHue] = useState(170);
    const [sat, setSat] = useState(100);
    const [light, setLight] = useState(50);

    // Update CSS variables on change
    useEffect(() => {
        document.documentElement.style.setProperty('--accent-hue', hue);
        document.documentElement.style.setProperty('--accent-sat', `${sat}%`);
        document.documentElement.style.setProperty('--accent-light', `${light}%`);
    }, [hue, sat, light]);

    return (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', color: 'var(--accent-color)' }}>
                Chroma Control
            </h3>

            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '5px' }}>
                    <span>HUE</span>
                    <span>{hue}°</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(e.target.value)}
                    className="glass-slider"
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '5px' }}>
                    <span>SATURATION</span>
                    <span>{sat}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sat}
                    onChange={(e) => setSat(e.target.value)}
                    className="glass-slider"
                />
            </div>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '5px' }}>
                    <span>LIGHTNESS</span>
                    <span>{light}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={light}
                    onChange={(e) => setLight(e.target.value)}
                    className="glass-slider"
                />
            </div>
        </div>
    );
};

export default RGBController;
