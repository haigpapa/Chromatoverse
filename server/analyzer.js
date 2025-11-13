import fs from 'fs';
import path from 'path';

/**
 * Directories and files to ignore during traversal
 */
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'temp']);
const IGNORE_FILES = new Set(['.DS_Store', 'package-lock.json', 'yarn.lock', '.gitignore']);

/**
 * Recursively walks a directory and returns all valid file paths
 */
function walkDirectory(dir, baseDir = dir) {
  const files = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        if (IGNORE_DIRS.has(entry.name)) {
          continue;
        }
        files.push(...walkDirectory(fullPath, baseDir));
      } else if (entry.isFile()) {
        if (IGNORE_FILES.has(entry.name)) {
          continue;
        }
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return files;
}

/**
 * Reads the content of a file
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extracts import/require statements from code
 */
function extractDependencies(content, filePath) {
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

/**
 * Determines the programming language from file extension
 */
function getLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const languageMap = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.go': 'Go',
    '.rs': 'Rust',
    '.rb': 'Ruby',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.html': 'HTML',
    '.json': 'JSON',
    '.xml': 'XML',
    '.yml': 'YAML',
    '.yaml': 'YAML',
    '.md': 'Markdown',
    '.txt': 'Text',
    '.sh': 'Shell',
    '.sql': 'SQL'
  };

  return languageMap[ext] || 'Unknown';
}

/**
 * Determines the file's architectural role
 */
function getRole(filePath, content) {
  const fileName = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();

  if (['.json', '.yml', '.yaml', '.toml', '.ini', '.env'].includes(ext) ||
      fileName.includes('config') || fileName.includes('.config')) {
    return 'Configuration';
  }

  if (['.md', '.txt'].includes(ext) || fileName === 'readme') {
    return 'Documentation';
  }

  if (fileName.includes('test') || fileName.includes('spec') || filePath.includes('/test/') || filePath.includes('/__tests__/')) {
    return 'Testing';
  }

  if (['.css', '.scss', '.sass', '.less'].includes(ext)) {
    return 'Styling';
  }

  if (content) {
    if ((ext === '.jsx' || ext === '.tsx') &&
        (content.includes('export default') || content.includes('export const') || content.includes('export function'))) {
      return 'UI Component';
    }

    if (content.includes('fetch(') || content.includes('axios') || content.includes('http.') ||
        filePath.includes('/api/') || filePath.includes('/service')) {
      return 'API Service';
    }

    if (content.includes('reducer') || content.includes('dispatch') || content.includes('createStore') ||
        filePath.includes('/store/') || filePath.includes('/redux/') || filePath.includes('/state/')) {
      return 'State Management';
    }

    if (content.includes('Router') || content.includes('Route') || filePath.includes('/route')) {
      return 'Routing';
    }

    if (filePath.includes('/util') || filePath.includes('/helper') || fileName.includes('util') || fileName.includes('helper')) {
      return 'Utility';
    }
  }

  return 'Other';
}

/**
 * Generates a summary for the file
 */
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

/**
 * Mock AI analysis function
 */
function mockAIAnalysis(file) {
  const language = getLanguage(file.path);
  const role = getRole(file.path, file.content);
  const summary = generateSummary(file.path, role, language);
  const dependencies = extractDependencies(file.content, file.path);

  return {
    path: file.path,
    language,
    role,
    summary,
    dependencies
  };
}

/**
 * Creates a manifest of all files with their content
 */
function createFileManifest(filePaths, baseDir) {
  const manifest = [];

  for (const relativePath of filePaths) {
    const absolutePath = path.join(baseDir, relativePath);
    const content = readFileContent(absolutePath);

    if (content !== null) {
      manifest.push({
        path: relativePath,
        content: content
      });
    }
  }

  return manifest;
}

/**
 * Normalizes a file path for dependency matching
 */
function normalizeDependencyPath(basePath, importPath) {
  const baseDir = path.dirname(basePath);
  const resolved = path.normalize(path.join(baseDir, importPath));
  return resolved;
}

/**
 * Generates project-wide analysis
 */
function generateProjectAnalysis(nodes, targetDir) {
  const languages = new Set();
  const roles = new Set();

  nodes.forEach(node => {
    languages.add(node.language);
    roles.add(node.role);
  });

  const dirName = path.basename(path.resolve(targetDir));

  return {
    projectName: dirName,
    projectSummary: `${dirName} project with ${nodes.length} files using ${Array.from(languages).join(', ')}`,
    architecture: `Multi-file project with ${Array.from(roles).join(', ')} components`,
    fileCount: nodes.length,
    languages: Array.from(languages),
    roles: Array.from(roles)
  };
}

/**
 * Main analysis function (exported for use by server)
 */
export async function analyzeDirectory(targetDir) {
  const absolutePath = path.resolve(targetDir);

  console.log(`[Analyzer] Analyzing: ${absolutePath}`);

  // Walk the directory tree
  const filePaths = walkDirectory(absolutePath);
  console.log(`[Analyzer] Found ${filePaths.length} files`);

  // Create file manifest with content
  const fileManifest = createFileManifest(filePaths, absolutePath);
  console.log(`[Analyzer] Read ${fileManifest.length} files`);

  // Run AI analysis on each file
  const analyzedFiles = fileManifest.map(file => mockAIAnalysis(file));
  console.log(`[Analyzer] Analyzed ${analyzedFiles.length} files`);

  // Create nodes for the graph
  const nodes = analyzedFiles.map((file) => ({
    id: file.path,
    label: path.basename(file.path),
    path: file.path,
    language: file.language,
    role: file.role,
    summary: file.summary,
    dependencies: file.dependencies,
    size: file.dependencies.length + 1,
    content: fileManifest.find(f => f.path === file.path)?.content || ''
  }));

  // Create links from dependencies
  const links = [];
  const nodePathMap = new Map(nodes.map(node => [node.path, node]));

  nodes.forEach(node => {
    node.dependencies.forEach(dep => {
      const normalizedDep = normalizeDependencyPath(node.path, dep);

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
        links.push({
          source: node.id,
          target: targetNode.id
        });
      }
    });
  });

  console.log(`[Analyzer] Created ${links.length} dependency links`);

  // Generate project-wide analysis
  const projectAnalysis = generateProjectAnalysis(nodes, targetDir);

  // Create final output
  const codeverseData = {
    meta: {
      analyzedAt: new Date().toISOString(),
      analyzer: 'Codeverse Explorer v1.0 (Phase 1)',
      directory: absolutePath
    },
    project: projectAnalysis,
    graph: {
      nodes,
      links
    }
  };

  return codeverseData;
}
