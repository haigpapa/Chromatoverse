#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Directories and files to ignore during traversal
 */
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);
const IGNORE_FILES = new Set(['.DS_Store', 'package-lock.json', 'yarn.lock', '.gitignore']);

/**
 * Recursively walks a directory and returns all valid file paths
 * @param {string} dir - The directory to walk
 * @param {string} baseDir - The base directory for calculating relative paths
 * @returns {string[]} - Array of relative file paths
 */
function walkDirectory(dir, baseDir = dir) {
  const files = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        // Skip ignored directories
        if (IGNORE_DIRS.has(entry.name)) {
          continue;
        }
        // Recursively walk subdirectories
        files.push(...walkDirectory(fullPath, baseDir));
      } else if (entry.isFile()) {
        // Skip ignored files
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
 * @param {string} filePath - Absolute path to the file
 * @returns {string|null} - File content or null if error
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
 * @param {string} content - File content
 * @param {string} filePath - File path for context
 * @returns {string[]} - Array of imported file paths
 */
function extractDependencies(content, filePath) {
  const dependencies = new Set();

  // Match ES6 imports: import ... from 'path'
  const importRegex = /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g;
  // Match CommonJS requires: require('path')
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    // Only include relative imports (local files)
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      dependencies.add(importPath);
    }
  }

  while ((match = requireRegex.exec(content)) !== null) {
    const importPath = match[1];
    // Only include relative imports (local files)
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      dependencies.add(importPath);
    }
  }

  return Array.from(dependencies);
}

/**
 * Determines the programming language from file extension
 * @param {string} filePath - The file path
 * @returns {string} - The language name
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
 * @param {string} filePath - The file path
 * @param {string} content - The file content
 * @returns {string} - The role
 */
function getRole(filePath, content) {
  const fileName = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase();

  // Configuration files
  if (['.json', '.yml', '.yaml', '.toml', '.ini', '.env'].includes(ext) ||
      fileName.includes('config') || fileName.includes('.config')) {
    return 'Configuration';
  }

  // Documentation
  if (['.md', '.txt'].includes(ext) || fileName === 'readme') {
    return 'Documentation';
  }

  // Testing
  if (fileName.includes('test') || fileName.includes('spec') || filePath.includes('/test/') || filePath.includes('/__tests__/')) {
    return 'Testing';
  }

  // Styling
  if (['.css', '.scss', '.sass', '.less'].includes(ext)) {
    return 'Styling';
  }

  // Check content for specific patterns
  if (content) {
    // React components
    if ((ext === '.jsx' || ext === '.tsx') &&
        (content.includes('export default') || content.includes('export const') || content.includes('export function'))) {
      return 'UI Component';
    }

    // API/Services
    if (content.includes('fetch(') || content.includes('axios') || content.includes('http.') ||
        filePath.includes('/api/') || filePath.includes('/service')) {
      return 'API Service';
    }

    // State Management
    if (content.includes('reducer') || content.includes('dispatch') || content.includes('createStore') ||
        filePath.includes('/store/') || filePath.includes('/redux/') || filePath.includes('/state/')) {
      return 'State Management';
    }

    // Routing
    if (content.includes('Router') || content.includes('Route') || filePath.includes('/route')) {
      return 'Routing';
    }

    // Utilities
    if (filePath.includes('/util') || filePath.includes('/helper') || fileName.includes('util') || fileName.includes('helper')) {
      return 'Utility';
    }
  }

  return 'Other';
}

/**
 * Generates a summary for the file based on its characteristics
 * @param {string} filePath - The file path
 * @param {string} role - The file's role
 * @param {string} language - The file's language
 * @returns {string} - A one-sentence summary
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
 * Mock AI analysis function (Phase 0)
 * In Phase 1+, this will call the OpenAI API
 * @param {Object} file - File object with path and content
 * @returns {Object} - Analysis result
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
 * @param {string[]} filePaths - Array of relative file paths
 * @param {string} baseDir - Base directory for resolving paths
 * @returns {Array<{path: string, content: string}>} - File manifest
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
 * @param {string} basePath - The base file path
 * @param {string} importPath - The imported path
 * @returns {string} - Normalized path
 */
function normalizeDependencyPath(basePath, importPath) {
  const baseDir = path.dirname(basePath);
  const resolved = path.normalize(path.join(baseDir, importPath));

  // Try adding common extensions
  const possiblePaths = [
    resolved,
    resolved + '.js',
    resolved + '.jsx',
    resolved + '.ts',
    resolved + '.tsx',
    path.join(resolved, 'index.js'),
    path.join(resolved, 'index.jsx'),
    path.join(resolved, 'index.ts'),
    path.join(resolved, 'index.tsx')
  ];

  return possiblePaths[0]; // Return the base resolved path
}

/**
 * Generates project-wide analysis
 * @param {Array} nodes - Array of analyzed file nodes
 * @param {string} targetDir - The target directory
 * @returns {Object} - Project analysis
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
 * Main function to analyze a directory
 * @param {string} targetDir - The directory to analyze
 */
async function main(targetDir = '.') {
  const absolutePath = path.resolve(targetDir);

  console.log('🔍 Codeverse Analyzer - Starting analysis...');
  console.log(`📁 Target directory: ${absolutePath}\n`);

  // Walk the directory tree
  const filePaths = walkDirectory(absolutePath);
  console.log(`📄 Found ${filePaths.length} files`);

  // Create file manifest with content
  console.log('📖 Reading file contents...');
  const fileManifest = createFileManifest(filePaths, absolutePath);
  console.log(`✅ Read ${fileManifest.length} files successfully`);

  // Run AI analysis on each file
  console.log('🧠 Running AI analysis...');
  const analyzedFiles = fileManifest.map(file => mockAIAnalysis(file));
  console.log(`✅ Analyzed ${analyzedFiles.length} files\n`);

  // Create nodes for the graph
  const nodes = analyzedFiles.map((file, index) => ({
    id: file.path,
    label: path.basename(file.path),
    path: file.path,
    language: file.language,
    role: file.role,
    summary: file.summary,
    dependencies: file.dependencies,
    size: file.dependencies.length + 1, // Size based on connections
    content: fileManifest.find(f => f.path === file.path)?.content || ''
  }));

  // Create links from dependencies
  console.log('🔗 Building dependency graph...');
  const links = [];
  const nodePathMap = new Map(nodes.map(node => [node.path, node]));

  nodes.forEach(node => {
    node.dependencies.forEach(dep => {
      // Try to resolve the dependency to an actual file
      const normalizedDep = normalizeDependencyPath(node.path, dep);

      // Find matching node (try exact match first, then partial)
      let targetNode = nodePathMap.get(normalizedDep);
      if (!targetNode) {
        // Try to find a node that ends with the normalized path
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

  console.log(`✅ Created ${links.length} dependency links\n`);

  // Generate project-wide analysis
  const projectAnalysis = generateProjectAnalysis(nodes, targetDir);

  // Create final output
  const codeverseData = {
    meta: {
      analyzedAt: new Date().toISOString(),
      analyzer: 'Codeverse Explorer v1.0 (Phase 0)',
      directory: absolutePath
    },
    project: projectAnalysis,
    graph: {
      nodes,
      links
    }
  };

  // Write codeverse-data.json
  const outputPath = path.join(absolutePath, 'codeverse-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(codeverseData, null, 2), 'utf-8');
  console.log(`💾 Codeverse data saved to: ${outputPath}`);

  // Also keep the manifest for debugging
  const manifestPath = path.join(absolutePath, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(fileManifest, null, 2), 'utf-8');

  console.log('\n✨ Analysis complete!');
  console.log(`   Files analyzed: ${nodes.length}`);
  console.log(`   Dependencies found: ${links.length}`);
  console.log(`   Languages: ${projectAnalysis.languages.join(', ')}`);
}

// Run the script
const targetDir = process.argv[2] || '.';
main(targetDir).catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
