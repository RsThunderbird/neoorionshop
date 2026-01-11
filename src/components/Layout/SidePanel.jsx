import React, { useState, useEffect, useRef } from 'react';
import SettingsModal from '../Controls/SettingsModal';
import { useSystem } from '../../context/SystemContext';

const SidePanel = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const { logs } = useSystem();
    const scrollRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <>
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

            <div className={`side-panel ${isOpen ? 'open' : 'closed'}`} style={{
                width: isOpen ? '350px' : '0px',
                height: '100%',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderLeft: isOpen ? '1px solid var(--glass-border)' : 'none',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px', color: 'var(--accent-color)' }}>SYSTEM PROCESSES</span>
                    <div>
                        <button onClick={() => setShowSettings(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', fontSize: '1rem', marginRight: '10px' }}>⚙</button>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                    </div>
                </div>

                <div ref={scrollRef} style={{ padding: '1rem', flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--accent-color)' }}>[SYSTEM] NeoOrion initialized.</div>
                    {logs.map((log, index) => (
                        <div key={index} style={{ marginBottom: '0.5rem', opacity: 0.8, borderLeft: '2px solid var(--glass-border)', paddingLeft: '8px', wordBreak: 'break-word' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>

            {!isOpen && (
                <div style={{ position: 'absolute', right: 0, top: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="glass-button"
                        style={{
                            borderRight: 'none',
                            borderRadius: '12px 0 0 12px',
                            padding: '8px 12px',
                            fontSize: '0.8rem'
                        }}
                    >
                        LOGS
                    </button>
                </div>
            )}
        </>
    );
};

export default SidePanel;
