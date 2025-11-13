import { useState, useEffect } from 'react'
import Constellation from './components/Constellation'
import Sidebar from './components/Sidebar'
import LandingPage from './components/LandingPage'

// API URL: uses environment variable or defaults to empty string for Vercel (same-origin)
// In development with local server, set VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [mode, setMode] = useState('landing') // 'landing', 'analyzing', 'visualization'
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [analyzeProgress, setAnalyzeProgress] = useState('')

  // Try to load local codeverse-data.json on mount (Phase 0 support)
  useEffect(() => {
    fetch('/codeverse-data.json')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('No local data')
      })
      .then(jsonData => {
        setData(jsonData)
        setMode('visualization')
      })
      .catch(() => {
        // If no local data, stay on landing page
        setMode('landing')
      })
  }, [])

  const handleAnalyze = async (githubUrl) => {
    setMode('analyzing')
    setError(null)
    setAnalyzeProgress('Connecting to server...')

    try {
      setAnalyzeProgress('Cloning repository...')

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ githubUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze repository')
      }

      setAnalyzeProgress('Analyzing codebase...')
      const analysisData = await response.json()

      setData(analysisData)
      setMode('visualization')
      setAnalyzeProgress('')
    } catch (err) {
      setError(err.message)
      setMode('landing')
      setAnalyzeProgress('')
    }
  }

  const handleReset = () => {
    setMode('landing')
    setData(null)
    setError(null)
    setSelectedNode(null)
  }

  // Landing page with GitHub URL input
  if (mode === 'landing') {
    return <LandingPage onAnalyze={handleAnalyze} error={error} />
  }

  // Analyzing state
  if (mode === 'analyzing') {
    return (
      <div className="loading">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ marginBottom: '10px' }}>Analyzing Repository...</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>{analyzeProgress}</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Visualization mode
  if (mode === 'visualization' && data) {
    return (
      <div className="app">
        <header className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Codeverse Explorer</h1>
              <p>{data.project.projectSummary}</p>
            </div>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              New Analysis
            </button>
          </div>
        </header>

        <div className="main-content">
          <div className="canvas-container">
            <Constellation
              nodes={data.graph.nodes}
              links={data.graph.links}
              onNodeClick={setSelectedNode}
            />

            <div className="controls">
              <p><strong>Controls:</strong></p>
              <p>Left Click + Drag: Rotate</p>
              <p>Right Click + Drag: Pan</p>
              <p>Scroll: Zoom</p>
              <p>Click Node: View Details</p>
            </div>
          </div>

          <Sidebar
            project={data.project}
            meta={data.meta}
            selectedNode={selectedNode}
            nodes={data.graph.nodes}
          />
        </div>
      </div>
    )
  }

  return null
}

export default App
