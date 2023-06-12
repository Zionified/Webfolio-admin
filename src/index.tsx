import React from 'react';
import ReactDOM from 'react-dom/client';
import "@/assets/styles/index.scss"
import "@/axios.config"
import "@/mock"
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);

