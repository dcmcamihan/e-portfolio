import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import 'lenis/dist/lenis.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import { UIProvider } from './lib/ui';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <UIProvider>
        <App />
      </UIProvider>
    </BrowserRouter>
  </StrictMode>,
);
