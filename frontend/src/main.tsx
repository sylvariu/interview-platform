import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {setupInterceptors} from "./shared/api/interceptors.ts";

setupInterceptors();

createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
)
