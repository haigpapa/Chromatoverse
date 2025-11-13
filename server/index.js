import express from 'express';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import { analyzeDirectory } from './analyzer.js';
import { explainError } from './ai-analyzer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary directory for cloned repos
const TEMP_DIR = path.join(__dirname, 'temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Validates GitHub URL
 */
function isValidGitHubUrl(url) {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/;
  return githubRegex.test(url);
}

/**
 * Extracts repo name from GitHub URL
 */
function getRepoName(url) {
  const match = url.match(/github\.com\/[\w-]+\/([\w.-]+)/);
  return match ? match[1].replace('.git', '') : null;
}

/**
 * Cleans up old temporary directories
 */
async function cleanupTempDir(repoPath) {
  try {
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
      console.log(`[Server] Cleaned up: ${repoPath}`);
    }
  } catch (error) {
    console.error(`[Server] Error cleaning up ${repoPath}:`, error.message);
  }
}

/**
 * POST /api/analyze
 * Accepts a GitHub URL, clones the repo, analyzes it, and returns the data
 */
app.post('/api/analyze', async (req, res) => {
  const { githubUrl } = req.body;

  // Validation
  if (!githubUrl) {
    return res.status(400).json({
      error: 'Missing githubUrl parameter'
    });
  }

  if (!isValidGitHubUrl(githubUrl)) {
    return res.status(400).json({
      error: 'Invalid GitHub URL. Please provide a valid public GitHub repository URL.'
    });
  }

  const repoName = getRepoName(githubUrl);
  if (!repoName) {
    return res.status(400).json({
      error: 'Could not extract repository name from URL'
    });
  }

  // Generate unique directory for this analysis
  const timestamp = Date.now();
  const repoPath = path.join(TEMP_DIR, `${repoName}-${timestamp}`);

  try {
    console.log(`[Server] Analyzing ${githubUrl}...`);

    // Clone the repository
    console.log(`[Server] Cloning repository to ${repoPath}...`);
    const git = simpleGit();
    await git.clone(githubUrl, repoPath, ['--depth', '1']); // Shallow clone for speed
    console.log(`[Server] Clone complete`);

    // Analyze the repository
    console.log(`[Server] Running analysis...`);
    const analysisData = await analyzeDirectory(repoPath);

    // Clean up the cloned repo
    await cleanupTempDir(repoPath);

    // Return the analysis
    console.log(`[Server] Analysis complete for ${repoName}`);
    res.json(analysisData);

  } catch (error) {
    console.error(`[Server] Error analyzing ${githubUrl}:`, error.message);

    // Clean up on error
    await cleanupTempDir(repoPath);

    // Determine error type
    if (error.message.includes('not found') || error.message.includes('404')) {
      return res.status(404).json({
        error: 'Repository not found. Please check the URL and ensure the repository is public.'
      });
    }

    if (error.message.includes('authentication') || error.message.includes('403')) {
      return res.status(403).json({
        error: 'Access denied. This may be a private repository.'
      });
    }

    res.status(500).json({
      error: 'Failed to analyze repository. Please try again.',
      details: error.message
    });
  }
});

/**
 * POST /api/explain-error
 * AI Error Explainer - analyzes error stack traces
 */
app.post('/api/explain-error', async (req, res) => {
  const { errorTrace, files } = req.body;

  if (!errorTrace) {
    return res.status(400).json({
      error: 'Missing errorTrace parameter'
    });
  }

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      error: 'Missing or invalid files array'
    });
  }

  try {
    console.log(`[Server] Explaining error...`);
    const explanation = await explainError(errorTrace, files);

    if (explanation.error) {
      return res.status(503).json({
        error: 'AI analysis not available',
        details: explanation.error
      });
    }

    res.json(explanation);
  } catch (error) {
    console.error(`[Server] Error explaining error:`, error.message);
    res.status(500).json({
      error: 'Failed to explain error',
      details: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  const aiEnabled = !!process.env.OPENAI_API_KEY;
  res.json({
    status: 'ok',
    message: 'Codeverse Explorer API is running',
    version: '1.1.0 (Phase 3)',
    features: {
      aiAnalysis: aiEnabled,
      errorExplainer: aiEnabled
    }
  });
});

/**
 * Cleanup old temp directories on startup
 */
async function startupCleanup() {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      if (fs.statSync(filePath).isDirectory()) {
        await cleanupTempDir(filePath);
      }
    }
    console.log('[Server] Startup cleanup complete');
  } catch (error) {
    console.error('[Server] Startup cleanup error:', error.message);
  }
}

// Start server
app.listen(PORT, async () => {
  await startupCleanup();
  console.log(`\n🚀 Codeverse Explorer API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Analysis endpoint: POST http://localhost:${PORT}/api/analyze\n`);
});
