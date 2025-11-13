import { simpleGit } from 'simple-git';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Analysis functions (copied from server/analyzer.js but inline for serverless)
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'temp', '.vercel']);
const IGNORE_FILES = new Set(['.DS_Store', 'package-lock.json', 'yarn.lock', '.gitignore']);

function walkDirectory(dir, baseDir = dir) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.has(entry.name)) continue;
        files.push(...walkDirectory(fullPath, baseDir));
      } else if (entry.isFile()) {
        if (IGNORE_FILES.has(entry.name)) continue;
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  return files;
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

function extractDependencies(content) {
  const dependencies = new Set();
  const importRegex = /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g;
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      dependencies.add(importPath);
    }
  }
  while ((match = requireRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      dependencies.add(importPath);
    }
  }
  return Array.from(dependencies);
}

function getLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const languageMap = {
    '.js': 'JavaScript', '.jsx': 'JavaScript', '.ts': 'TypeScript', '.tsx': 'TypeScript',
    '.py': 'Python', '.java': 'Java', '.cpp': 'C++', '.c': 'C', '.cs': 'C#',
    '.go': 'Go', '.rs': 'Rust', '.rb': 'Ruby', '.php': 'PHP', '.swift': 'Swift',
    '.kt': 'Kotlin', '.css': 'CSS', '.scss': 'SCSS', '.sass': 'Sass',
    '.html': 'HTML', '.json': 'JSON', '.xml': 'XML', '.yml': 'YAML', '.yaml': 'YAML',
    '.md': 'Markdown', '.txt': 'Text', '.sh': 'Shell', '.sql': 'SQL'
  };
  return languageMap[ext] || 'Unknown';
}

function getRole(filePath, content) {
  const fileName = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();
  if (['.json', '.yml', '.yaml', '.toml', '.ini', '.env'].includes(ext) ||
      fileName.includes('config') || fileName.includes('.config')) return 'Configuration';
  if (['.md', '.txt'].includes(ext) || fileName === 'readme') return 'Documentation';
  if (fileName.includes('test') || fileName.includes('spec') || filePath.includes('/test/') || filePath.includes('/__tests__/')) return 'Testing';
  if (['.css', '.scss', '.sass', '.less'].includes(ext)) return 'Styling';
  if (content) {
    if ((ext === '.jsx' || ext === '.tsx') &&
        (content.includes('export default') || content.includes('export const') || content.includes('export function'))) return 'UI Component';
    if (content.includes('fetch(') || content.includes('axios') || content.includes('http.') ||
        filePath.includes('/api/') || filePath.includes('/service')) return 'API Service';
    if (content.includes('reducer') || content.includes('dispatch') || content.includes('createStore') ||
        filePath.includes('/store/') || filePath.includes('/redux/') || filePath.includes('/state/')) return 'State Management';
    if (content.includes('Router') || content.includes('Route') || filePath.includes('/route')) return 'Routing';
    if (filePath.includes('/util') || filePath.includes('/helper') || fileName.includes('util') || fileName.includes('helper')) return 'Utility';
  }
  return 'Other';
}

function generateSummary(filePath, role, language) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const summaries = {
    'UI Component': `${fileName} component handles UI rendering and user interactions`,
    'Styling': `Defines visual styles and layout for ${fileName}`,
    'API Service': `Manages API calls and data fetching for ${fileName}`,
    'Utility': `Provides helper functions and utilities for ${fileName}`,
    'State Management': `Manages application state for ${fileName}`,
    'Routing': `Handles routing and navigation for ${fileName}`,
    'Configuration': `Configuration settings for ${fileName}`,
    'Testing': `Test suite for ${fileName} functionality`,
    'Documentation': `Documentation for ${fileName}`,
    'Other': `${language} file: ${fileName}`
  };
  return summaries[role] || `${language} file: ${fileName}`;
}

async function analyzeDirectory(targetDir) {
  const filePaths = walkDirectory(targetDir);
  const fileManifest = [];

  for (const relativePath of filePaths) {
    const absolutePath = path.join(targetDir, relativePath);
    const content = readFileContent(absolutePath);
    if (content !== null) {
      fileManifest.push({ path: relativePath, content: content });
    }
  }

  const nodes = fileManifest.map(file => {
    const language = getLanguage(file.path);
    const role = getRole(file.path, file.content);
    const summary = generateSummary(file.path, role, language);
    const dependencies = extractDependencies(file.content);

    return {
      id: file.path,
      label: path.basename(file.path),
      path: file.path,
      language,
      role,
      summary,
      dependencies,
      size: dependencies.length + 1,
      content: file.content
    };
  });

  const links = [];
  const nodePathMap = new Map(nodes.map(node => [node.path, node]));

  nodes.forEach(node => {
    node.dependencies.forEach(dep => {
      const normalizedDep = path.normalize(path.join(path.dirname(node.path), dep));
      let targetNode = nodePathMap.get(normalizedDep);
      if (!targetNode) {
        for (const [nodePath, n] of nodePathMap) {
          if (nodePath.endsWith(normalizedDep) || normalizedDep.endsWith(nodePath)) {
            targetNode = n;
            break;
          }
        }
      }
      if (targetNode && targetNode.id !== node.id) {
        links.push({ source: node.id, target: targetNode.id });
      }
    });
  });

  const languages = new Set();
  const roles = new Set();
  nodes.forEach(node => {
    languages.add(node.language);
    roles.add(node.role);
  });

  const dirName = path.basename(path.resolve(targetDir));

  return {
    meta: {
      analyzedAt: new Date().toISOString(),
      analyzer: 'Codeverse Explorer v1.0 (Vercel)',
      directory: targetDir
    },
    project: {
      projectName: dirName,
      projectSummary: `${dirName} project with ${nodes.length} files using ${Array.from(languages).join(', ')}`,
      architecture: `Multi-file project with ${Array.from(roles).join(', ')} components`,
      fileCount: nodes.length,
      languages: Array.from(languages),
      roles: Array.from(roles)
    },
    graph: { nodes, links }
  };
}

function isValidGitHubUrl(url) {
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/;
  return githubRegex.test(url);
}

function getRepoName(url) {
  const match = url.match(/github\.com\/[\w-]+\/([\w.-]+)/);
  return match ? match[1].replace('.git', '') : null;
}

async function cleanupTempDir(repoPath) {
  try {
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error(`Cleanup error:`, error.message);
  }
}

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { githubUrl } = req.body;

  if (!githubUrl) {
    return res.status(400).json({ error: 'Missing githubUrl parameter' });
  }

  if (!isValidGitHubUrl(githubUrl)) {
    return res.status(400).json({
      error: 'Invalid GitHub URL. Please provide a valid public GitHub repository URL.'
    });
  }

  const repoName = getRepoName(githubUrl);
  if (!repoName) {
    return res.status(400).json({ error: 'Could not extract repository name from URL' });
  }

  // Use /tmp directory (Vercel's temporary storage)
  const timestamp = Date.now();
  const repoPath = `/tmp/${repoName}-${timestamp}`;

  try {
    console.log(`[Vercel] Analyzing ${githubUrl}...`);

    // Clone the repository
    const git = simpleGit();
    await git.clone(githubUrl, repoPath, ['--depth', '1']);

    // Analyze the repository
    const analysisData = await analyzeDirectory(repoPath);

    // Clean up
    await cleanupTempDir(repoPath);

    return res.status(200).json(analysisData);

  } catch (error) {
    console.error(`[Vercel] Error:`, error.message);
    await cleanupTempDir(repoPath);

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

    return res.status(500).json({
      error: 'Failed to analyze repository. Please try again.',
      details: error.message
    });
  }
}
