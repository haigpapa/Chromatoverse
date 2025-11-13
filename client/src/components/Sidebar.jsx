import { useState } from 'react'

const ROLE_COLORS = {
  'UI Component': '#667eea',
  'Styling': '#f093fb',
  'API Service': '#4facfe',
  'Utility': '#43e97b',
  'State Management': '#fa709a',
  'Routing': '#feca57',
  'Configuration': '#ee5a6f',
  'Testing': '#c471ed',
  'Documentation': '#48dbfb',
  'Other': '#a29bfe'
}

function Sidebar({ project, meta, selectedNode, nodes }) {
  const [activeTab, setActiveTab] = useState('overview')

  const roleStats = nodes.reduce((acc, node) => {
    acc[node.role] = (acc[node.role] || 0) + 1
    return acc
  }, {})

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: '8px',
              background: activeTab === 'overview' ? '#667eea' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('files')}
            style={{
              flex: 1,
              padding: '8px',
              background: activeTab === 'files' ? '#667eea' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Files
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="sidebar-section">
            <h3>Project Info</h3>
            <div className="stats">
              <div className="stat-item">
                <span>Name:</span>
                <strong>{project.projectName}</strong>
              </div>
              <div className="stat-item">
                <span>Files:</span>
                <strong>{project.fileCount}</strong>
              </div>
              <div className="stat-item">
                <span>Languages:</span>
                <strong>{project.languages.join(', ')}</strong>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Architecture</h3>
            <p>{project.architecture}</p>
          </div>

          <div className="sidebar-section">
            <h3>Legend</h3>
            <div className="legend">
              {Object.entries(roleStats).map(([role, count]) => (
                <div key={role} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ background: ROLE_COLORS[role] || ROLE_COLORS['Other'] }}
                  />
                  <span>{role} ({count})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Analysis Info</h3>
            <div className="stats">
              <div className="stat-item">
                <span>Analyzed:</span>
                <strong>{new Date(meta.analyzedAt).toLocaleString()}</strong>
              </div>
              <div className="stat-item">
                <span>Analyzer:</span>
                <strong>{meta.analyzer}</strong>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'files' && (
        <div className="sidebar-section">
          {selectedNode ? (
            <>
              <h3>Selected File</h3>
              <div style={{ marginBottom: '15px' }}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '10px',
                  wordBreak: 'break-all'
                }}>
                  {selectedNode.label}
                </p>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  background: ROLE_COLORS[selectedNode.role] || ROLE_COLORS['Other'],
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '10px'
                }}>
                  {selectedNode.role}
                </div>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.7)',
                  marginTop: '10px',
                  lineHeight: '1.5'
                }}>
                  {selectedNode.summary}
                </p>
              </div>

              <div className="stats" style={{ marginTop: '15px' }}>
                <div className="stat-item">
                  <span>Language:</span>
                  <strong>{selectedNode.language}</strong>
                </div>
                <div className="stat-item">
                  <span>Path:</span>
                  <strong style={{ wordBreak: 'break-all', fontSize: '11px' }}>
                    {selectedNode.path}
                  </strong>
                </div>
                <div className="stat-item">
                  <span>Dependencies:</span>
                  <strong>{selectedNode.dependencies.length}</strong>
                </div>
              </div>

              {selectedNode.dependencies.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '8px'
                  }}>
                    Imports:
                  </h4>
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: '1.8'
                  }}>
                    {selectedNode.dependencies.map((dep, i) => (
                      <div key={i} style={{ wordBreak: 'break-all' }}>
                        • {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <h3>File List</h3>
              <p style={{ marginBottom: '15px', fontSize: '13px' }}>
                Click a node in the constellation to view details
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {nodes.map(node => (
                  <div
                    key={node.id}
                    style={{
                      padding: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      borderLeft: `3px solid ${ROLE_COLORS[node.role] || ROLE_COLORS['Other']}`
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                      {node.role}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar
