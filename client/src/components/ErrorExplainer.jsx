import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || '';

function ErrorExplainer({ files, onHighlightFiles, onClose }) {
  const [errorTrace, setErrorTrace] = useState('')
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!errorTrace.trim()) {
      setError('Please enter an error stack trace')
      return
    }

    setLoading(true)
    setError(null)
    setExplanation(null)

    // Clear previous highlights
    if (onHighlightFiles) {
      onHighlightFiles([])
    }

    try {
      const response = await fetch(`${API_URL}/api/explain-error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorTrace: errorTrace,
          files: files.map(f => ({ path: f.path, role: f.role }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to explain error')
      }

      const data = await response.json()
      setExplanation(data)

      // Highlight relevant files in the constellation
      if (data.likelyFiles && onHighlightFiles) {
        onHighlightFiles(data.likelyFiles)
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI Error Explainer
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Close
          </button>
        </div>

        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px', fontSize: '14px' }}>
          Paste your error stack trace below and AI will identify the likely files involved and suggest fixes.
        </p>

        <textarea
          value={errorTrace}
          onChange={(e) => setErrorTrace(e.target.value)}
          placeholder="Paste error stack trace here...

Example:
TypeError: Cannot read property 'map' of undefined
    at App.jsx:42:18
    at renderWithHooks (react-dom.js:1234:22)"
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: 'white',
            fontSize: '13px',
            fontFamily: 'monospace',
            resize: 'vertical',
            marginBottom: '15px'
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !errorTrace.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? 'rgba(102, 126, 234, 0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: loading || !errorTrace.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Analyzing...' : 'Explain Error'}
        </button>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '6px',
            color: '#ff6b6b',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            {error}
            {error.includes('AI analysis not available') && (
              <p style={{ marginTop: '8px', fontSize: '12px' }}>
                Configure OPENAI_API_KEY in your server environment to enable this feature.
              </p>
            )}
          </div>
        )}

        {explanation && (
          <div style={{
            padding: '20px',
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              margin: '0 0 10px 0',
              fontSize: '16px',
              color: '#667eea'
            }}>
              Analysis Results
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px' }}>
                Error Type:
              </strong>
              <p style={{ margin: '5px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                {explanation.errorType}
              </p>
            </div>

            {explanation.likelyFiles && explanation.likelyFiles.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px' }}>
                  Likely Involved Files:
                </strong>
                <div style={{ marginTop: '8px' }}>
                  {explanation.likelyFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '6px 10px',
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '1px solid rgba(102, 126, 234, 0.4)',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: '#a5b4fc'
                      }}
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px' }}>
                Explanation:
              </strong>
              <p style={{ margin: '5px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: '1.6' }}>
                {explanation.explanation}
              </p>
            </div>

            <div>
              <strong style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px' }}>
                Suggested Fix:
              </strong>
              <p style={{ margin: '5px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: '1.6' }}>
                {explanation.suggestions}
              </p>
            </div>
          </div>
        )}

        {explanation && explanation.likelyFiles && explanation.likelyFiles.length > 0 && (
          <p style={{
            marginTop: '15px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontStyle: 'italic'
          }}>
            💡 The highlighted files in the constellation are the likely culprits.
          </p>
        )}
      </div>
    </div>
  )
}

export default ErrorExplainer
