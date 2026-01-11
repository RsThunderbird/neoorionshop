import React from 'react';
import './index.css';
import './styles/glass.css';
import MainDisplay from './components/Layout/MainDisplay';
import SidePanel from './components/Layout/SidePanel';

import { SystemProvider } from './context/SystemContext';

function App() {
  return (
    <SystemProvider>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 10% 20%, rgba(var(--accent-hue), 100%, 20%, 0.1) 0%, transparent 40%)'
      }}>
        <MainDisplay />
        <SidePanel />
      </div>
    </SystemProvider>
  );
}

export default App;
