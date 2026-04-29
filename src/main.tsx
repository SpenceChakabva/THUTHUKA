import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from './App'
import { secureStorage } from './lib/crypto'
import './index.css'

async function bootstrap() {
  await secureStorage.init();

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
}

bootstrap();
