// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Ваш главный компонент App
import { BrowserRouter } from 'react-router-dom'; // Если BrowserRouter используется здесь
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- ДОБАВЛЕН ЭТОТ ИМПОРТ CSS

// import './index.css' // Ваши кастомные стили, если есть

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Если BrowserRouter здесь, он остается */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)