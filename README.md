# Codeverse Explorer - Phase 0

An AI-powered visual learning platform that transforms any codebase into an interactive 3D "constellation."

## What is Codeverse Explorer?

Codeverse Explorer helps developers, students, and teams rapidly understand complex software architecture by visualizing codebases as beautiful 3D constellation graphs. Each file becomes a node, colored by its role, and connected by its dependencies.

## Phase 0: Local-First MVP

This is **Phase 0** - a local-first proof of concept that validates the core analysis-to-visualization pipeline.

### Features

- **File Traversal**: Automatically walks any directory structure
- **Smart Analysis**: Identifies file language, role, and dependencies
- **3D Visualization**: Interactive force-directed graph using react-three-fiber
- **Project Insights**: Generates project-wide summaries and statistics
- **Interactive UI**: Click nodes to view file details, rotate/zoom the constellation

## Quick Start

### Prerequisites

- Node.js 18+ installed

### 1. Analyze Your Codebase

Run the analyzer on any directory:

```bash
node analyze.js .
```

This will:
- Scan all files in the directory
- Analyze each file (language, role, dependencies)
- Generate `codeverse-data.json`

### 2. Launch the Visualization

```bash
cd client
npm run dev
```

The 3D constellation will open in your browser at `http://localhost:3000`

### 3. Explore!

- **Rotate**: Left-click + drag
- **Pan**: Right-click + drag
- **Zoom**: Scroll wheel
- **Inspect**: Click any node to view file details

## Project Structure

```
/codeverse-explorer
├── analyze.js              # Core analysis engine (Node.js)
├── codeverse-data.json     # Generated analysis output
├── manifest.json           # File manifest (debug)
├── /client/                # React + Three.js frontend
│   ├── /src/
│   │   ├── App.jsx        # Main app component
│   │   ├── /components/
│   │   │   ├── Constellation.jsx  # 3D visualization
│   │   │   └── Sidebar.jsx        # Info panel
│   └── /public/
│       └── codeverse-data.json    # Data for visualization
└── README.md
```

## How It Works

### Analysis Engine (`analyze.js`)

1. **File Traversal**: Recursively walks directories, ignoring `node_modules`, `.git`, etc.
2. **Content Reading**: Reads file contents into memory
3. **AI Analysis** (mocked in Phase 0):
   - Detects language from file extension
   - Infers role from file path and content patterns
   - Extracts import/require statements for dependencies
   - Generates human-readable summaries
4. **Graph Generation**: Creates nodes and links for 3D visualization
5. **Output**: Saves structured JSON for frontend consumption

### Visualization (`client/`)

1. **Data Loading**: Fetches `codeverse-data.json`
2. **Layout Algorithm**: Positions nodes in 3D space (circular layout in Phase 0)
3. **Rendering**: Uses Three.js + react-three-fiber for GPU-accelerated 3D
4. **Interaction**: Orbit controls, node selection, sidebar updates

## Customization

### Analyze a Different Directory

```bash
node analyze.js /path/to/your/project
cd /path/to/your/project
# Copy the generated codeverse-data.json to client/public/
```

### Supported File Types

Currently analyzes:
- JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- Python (`.py`)
- CSS/SCSS (`.css`, `.scss`)
- JSON/YAML (`.json`, `.yml`)
- Markdown (`.md`)
- And many more...

### Role Detection

Files are automatically categorized as:
- **UI Component**: React/Vue components
- **API Service**: HTTP clients, fetch calls
- **Utility**: Helper functions
- **State Management**: Redux, stores
- **Routing**: Router files
- **Configuration**: Config files, env
- **Testing**: Test files
- **Documentation**: README, docs
- **Styling**: CSS, SCSS files

## Roadmap

### Phase 1: Public Web Service (Next)
- Build Express backend
- GitHub URL input
- Automatic repo cloning with `simple-git`
- Real OpenAI API integration

### Phase 2: Refinement & Interactivity
- Advanced filtering (by role, language)
- Search functionality
- Better force-directed layout algorithms
- Performance optimizations

### Phase 3: Future Vision
- Dynamic flow analysis (trace function calls)
- AI error explainer (paste stack trace, see affected files)
- Private repo support (OAuth)
- Team collaboration features

## Technology Stack

- **Analysis Engine**: Node.js (vanilla)
- **Frontend**: React 18 + Vite
- **3D Graphics**: Three.js + react-three-fiber + drei
- **Future Backend**: Express + OpenAI API

## Troubleshooting

### "Failed to load codeverse-data.json"

1. Make sure you ran `node analyze.js .` first
2. Check that `codeverse-data.json` exists in the root directory
3. Copy it to `client/public/codeverse-data.json`

### Empty visualization

If no nodes appear:
- Verify the analysis found files (check console output)
- Ensure your directory isn't empty or only contains ignored files

### Performance issues

For large codebases (500+ files):
- Consider filtering specific directories
- Phase 1 will include optimizations

## Contributing

This is Phase 0 - a proof of concept. Contributions welcome!

## License

MIT

---

Built with curiosity by developers, for developers.
