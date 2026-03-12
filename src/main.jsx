import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Nav } from './components/Nav.jsx'
import App from './App.jsx'
import TemplatesIndex from './pages/templates/TemplatesIndex.jsx'
import DesignCharter from './pages/templates/DesignCharter.jsx'
import DecisionLog from './pages/templates/DecisionLog.jsx'
import EvaluationHarness from './pages/templates/EvaluationHarness.jsx'
import PromptFrame from './pages/templates/PromptFrame.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/templates" element={<TemplatesIndex />} />
        <Route path="/templates/design-charter" element={<DesignCharter />} />
        <Route path="/templates/decision-log" element={<DecisionLog />} />
        <Route path="/templates/evaluation-harness" element={<EvaluationHarness />} />
        <Route path="/templates/prompt-frame" element={<PromptFrame />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
