import { useState } from 'react'

function LandingPage({ onAnalyze, error }) {
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(true)

  const validateUrl = (value) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/
    return githubRegex.test(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!url.trim()) {
      setIsValid(false)
      return
    }

    if (!validateUrl(url)) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    onAnalyze(url)
  }

  const handleInputChange = (e) => {
    setUrl(e.target.value)
    setIsValid(true)
  }

  const exampleRepos = [
    { name: 'react', url: 'https://github.com/facebook/react' },
    { name: 'vue', url: 'https://github.com/vuejs/vue' },
    { name: 'express', url: 'https://github.com/expressjs/express' }
  ]

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo/Title */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '15px'
          }}>
            Codeverse Explorer
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.6'
          }}>
            Transform any GitHub repository into an interactive 3D constellation.
            Understand codebases visually.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            border: isValid ? '2px solid rgba(255,255,255,0.1)' : '2px solid #ff6b6b',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'block',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              GITHUB REPOSITORY URL
            </label>
            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repository"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                transition: 'all 0.2s',
                fontFamily: 'monospace'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            {!isValid && (
              <p style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#ff6b6b',
                textAlign: 'left'
              }}>
                Please enter a valid public GitHub repository URL
              </p>
            )}
            {error && (
              <p style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#ff6b6b',
                textAlign: 'left'
              }}>
                Error: {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Analyze Repository
          </button>
        </form>

        {/* Example Repos */}
        <div>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '12px'
          }}>
            Try these examples:
          </p>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {exampleRepos.map((repo) => (
              <button
                key={repo.name}
                onClick={() => {
                  setUrl(repo.url)
                  setIsValid(true)
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                  e.target.style.color = 'rgba(255,255,255,0.9)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.05)'
                  e.target.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                {repo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{
          marginTop: '50px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Smart Analysis</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              AI-powered file classification
            </p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌌</div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>3D Visualization</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Interactive constellation view
            </p>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Instant Insights</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Understand architecture fast
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
