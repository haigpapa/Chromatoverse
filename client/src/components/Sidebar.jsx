import { useState, useMemo } from 'react'

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

function Sidebar({ project, meta, selectedNode, nodes, onFilterChange, onNodeSelect }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoles, setSelectedRoles] = useState(new Set())
  const [selectedLanguages, setSelectedLanguages] = useState(new Set())

  const roleStats = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.role] = (acc[node.role] || 0) + 1
      return acc
    }, {})
  }, [nodes])

  const languageStats = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.language] = (acc[node.language] || 0) + 1
      return acc
    }, {})
  }, [nodes])

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesPath = node.path.toLowerCase().includes(query)
        const matchesLabel = node.label.toLowerCase().includes(query)
        const matchesSummary = node.summary.toLowerCase().includes(query)
        if (!matchesPath && !matchesLabel && !matchesSummary) {
          return false
        }
      }

      // Role filter
      if (selectedRoles.size > 0 && !selectedRoles.has(node.role)) {
        return false
      }

      // Language filter
      if (selectedLanguages.size > 0 && !selectedLanguages.has(node.language)) {
        return false
      }

      return true
    })
  }, [nodes, searchQuery, selectedRoles, selectedLanguages])

  // Notify parent when filters change
  useMemo(() => {
    if (onFilterChange) {
      onFilterChange(filteredNodes)
    }
  }, [filteredNodes, onFilterChange])

  const toggleRole = (role) => {
    const newRoles = new Set(selectedRoles)
    if (newRoles.has(role)) {
      newRoles.delete(role)
    } else {
      newRoles.add(role)
    }
    setSelectedRoles(newRoles)
  }

  const toggleLanguage = (language) => {
    const newLanguages = new Set(selectedLanguages)
    if (newLanguages.has(language)) {
      newLanguages.delete(language)
    } else {
      newLanguages.add(language)
    }
    setSelectedLanguages(newLanguages)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedRoles(new Set())
    setSelectedLanguages(new Set())
  }

  const hasActiveFilters = searchQuery || selectedRoles.size > 0 || selectedLanguages.size > 0

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
            onClick={() => setActiveTab('filters')}
            style={{
              flex: 1,
              padding: '8px',
              background: activeTab === 'filters' ? '#667eea' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              position: 'relative'
            }}
          >
            Filters
            {hasActiveFilters && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                background: '#43e97b',
                borderRadius: '50%'
              }} />
            )}
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
              {hasActiveFilters && (
                <div className="stat-item">
                  <span>Filtered:</span>
                  <strong style={{ color: '#43e97b' }}>{filteredNodes.length}</strong>
                </div>
              )}
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

      {activeTab === 'filters' && (
        <>
          <div className="sidebar-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Search & Filter</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Search Files
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or path..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {searchQuery && (
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                  {filteredNodes.length} result{filteredNodes.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Role Filters */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Filter by Role
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(roleStats).map(([role, count]) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: selectedRoles.has(role) ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255,255,255,0.05)',
                      border: selectedRoles.has(role) ? '1px solid #667eea' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        background: ROLE_COLORS[role] || ROLE_COLORS['Other'],
                        flexShrink: 0
                      }}
                    />
                    <span style={{ flex: 1 }}>{role}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filters */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Filter by Language
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.entries(languageStats).map(([language, count]) => (
                  <button
                    key={language}
                    onClick={() => toggleLanguage(language)}
                    style={{
                      padding: '6px 10px',
                      background: selectedLanguages.has(language) ? '#667eea' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    {language} ({count})
                  </button>
                ))}
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

              <button
                onClick={() => onNodeSelect && onNodeSelect(null)}
                style={{
                  marginTop: '15px',
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Back to List
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>File List</h3>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  {filteredNodes.length}/{nodes.length}
                </span>
              </div>

              {/* Search in Files tab */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none',
                  marginBottom: '15px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: 'calc(100vh - 400px)',
                overflowY: 'auto'
              }}>
                {filteredNodes.map(node => (
                  <div
                    key={node.id}
                    onClick={() => onNodeSelect && onNodeSelect(node)}
                    style={{
                      padding: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      borderLeft: `3px solid ${ROLE_COLORS[node.role] || ROLE_COLORS['Other']}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                      {node.role}
                    </div>
                  </div>
                ))}
                {filteredNodes.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                    No files match your filters
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar
