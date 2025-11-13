import { useState, useEffect } from 'react'
import Constellation from './components/Constellation'
import Sidebar from './components/Sidebar'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    // Fetch the codeverse-data.json from the parent directory
    fetch('/codeverse-data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load codeverse-data.json')
        }
        return response.json()
      })
      .then(jsonData => {
        setData(jsonData)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="loading">Loading Codeverse...</div>
  }

  if (error) {
    return (
      <div className="error">
        <div>
          <h2>Error loading data</h2>
          <p>{error}</p>
          <p style={{ marginTop: '20px', fontSize: '14px' }}>
            Make sure you've run the analyzer: <code>node analyze.js .</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Codeverse Explorer</h1>
        <p>{data.project.projectSummary}</p>
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

export default App
