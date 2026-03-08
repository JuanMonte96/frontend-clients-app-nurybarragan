import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import './i18n'; // Importar configuración de i18n
import { AuthProvider } from './context/AuthContext.jsx';
import { ClassesProvider } from './context/ClassesContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClassesProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ClassesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
