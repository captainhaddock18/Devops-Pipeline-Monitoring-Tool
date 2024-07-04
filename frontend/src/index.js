import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './components/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
      <App />
  </AuthProvider>
);
