import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// Apply dark mode immediately — no flash
document.documentElement.classList.add('dark');

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AppContent = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0d1627',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          fontSize: '13px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        },
        success: {
          duration: 3000,
          iconTheme: { primary: '#4ade80', secondary: '#0d1627' },
        },
        error: {
          duration: 4000,
          iconTheme: { primary: '#f87171', secondary: '#0d1627' },
        },
      }}
    />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppContent />
      </GoogleOAuthProvider>
    ) : (
      <AppContent />
    )}
  </React.StrictMode>
);
