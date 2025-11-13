# Codeverse Explorer

An AI-powered visual learning platform that transforms any GitHub repository into an interactive 3D "constellation."

## What is Codeverse Explorer?

Codeverse Explorer helps developers, students, and teams rapidly understand complex software architecture by visualizing codebases as beautiful 3D constellation graphs. Each file becomes a node, colored by its role, and connected by its dependencies.

## Current Status: Phase 1 ✅

**Phase 1** is complete! The public web service with GitHub URL input is now live and functional.

### Features

**Phase 0 (Complete):**
- ✅ Local file analysis with `analyze.js`
- ✅ Smart file classification (language, role, dependencies)
- ✅ 3D force-directed graph visualization
- ✅ Interactive constellation with node inspection

**Phase 1 (Complete - NEW!):**
- ✅ Express backend API server
- ✅ GitHub URL input interface
- ✅ Automatic repository cloning
- ✅ Real-time analysis pipeline
- ✅ Beautiful landing page
- ✅ Error handling & validation
- ✅ Automatic cleanup

## Quick Start - Phase 1 (Web Service)

### Prerequisites

- Node.js 18+
- Git installed on your system

### Installation

```bash
# Clone this repository
git clone <your-repo-url>
cd codeverse-explorer

# Install all dependencies
npm run install:all
```

### Running the Application

**Terminal 1 - Start the Backend:**
```bash
npm run server
# Server starts on http://localhost:5000
```

**Terminal 2 - Start the Frontend:**
```bash
npm run client
# Frontend starts on http://localhost:3000
```

### How to Use

1. Open `http://localhost:3000` in your browser
2. Enter any public GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. Click "Analyze Repository"
4. Watch as the 3D constellation appears!
5. Explore:
   - **Rotate**: Left-click + drag
   - **Pan**: Right-click + drag
   - **Zoom**: Scroll wheel
   - **Inspect**: Click any node for details

## Alternative: Phase 0 (Local Analysis)

You can still analyze local projects directly:

```bash
# Analyze current directory
node analyze.js .

# Analyze specific directory
node analyze.js /path/to/project

# Copy data to frontend and run
npm run analyze:copy
cd client && npm run dev
```

## Project Structure

```
/codeverse-explorer
├── analyze.js              # Standalone local analyzer (Phase 0)
├── package.json            # Root package with scripts
├── README.md               # This file
│
├── /server/                # Backend API (Phase 1)
│   ├── index.js           # Express server
│   ├── analyzer.js        # Analysis engine module
│   ├── package.json       # Server dependencies
│   └── /temp/             # Temporary clone directory (auto-cleaned)
│
└── /client/                # React + Three.js frontend
    ├── /src/
    │   ├── App.jsx                    # Main app with mode switching
    │   ├── /components/
    │   │   ├── LandingPage.jsx       # GitHub URL input (Phase 1)
    │   │   ├── Constellation.jsx     # 3D visualization
    │   │   └── Sidebar.jsx           # Info panel
    │   └── main.jsx
    ├── /public/
    └── package.json
```

## API Documentation

### POST /api/analyze

Analyzes a GitHub repository and returns visualization data.

**Request:**
```json
{
  "githubUrl": "https://github.com/username/repository"
}
```

**Response:**
```json
{
  "meta": {
    "analyzedAt": "2025-11-13T00:00:00.000Z",
    "analyzer": "Codeverse Explorer v1.0 (Phase 1)",
    "directory": "/temp/path"
  },
  "project": {
    "projectName": "repository",
    "projectSummary": "...",
    "architecture": "...",
    "fileCount": 42,
    "languages": ["JavaScript", "CSS"],
    "roles": ["UI Component", "Configuration"]
  },
  "graph": {
    "nodes": [...],
    "links": [...]
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Codeverse Explorer API is running",
  "version": "1.0.0 (Phase 1)"
}
```

## How It Works

### Phase 1 Architecture

1. **User submits GitHub URL** → Frontend (React)
2. **POST /api/analyze** → Backend API (Express)
3. **Clone repository** → simple-git (shallow clone for speed)
4. **Analyze codebase** → analyzer.js module
   - File traversal
   - Language detection
   - Role classification
   - Dependency extraction
   - Graph generation
5. **Return JSON** → Frontend receives data
6. **Render 3D constellation** → Three.js + react-three-fiber
7. **Cleanup** → Temporary files deleted

### File Classification

Files are automatically categorized into 10 roles:

- **UI Component**: React/Vue components, UI code
- **API Service**: HTTP clients, API integrations
- **Utility**: Helper functions, common utilities
- **State Management**: Redux, stores, state logic
- **Routing**: Router configuration, route handlers
- **Configuration**: Config files, environment settings
- **Testing**: Test files, specs
- **Documentation**: README, docs, markdown
- **Styling**: CSS, SCSS, style files
- **Other**: Everything else

### Supported Languages

20+ languages including:
- JavaScript/TypeScript
- Python, Java, C++, Go, Rust
- CSS/SCSS/Sass
- HTML, JSON, YAML
- And more...

## Scripts Reference

```bash
# Development
npm run server          # Start backend API
npm run client          # Start frontend
npm run dev             # Show instructions for running both

# Installation
npm run install:all     # Install all dependencies
npm run server:install  # Install server deps only
npm run client:install  # Install client deps only

# Phase 0 (Local)
npm run analyze         # Analyze current directory
npm run analyze:copy    # Analyze and copy to client

# Production
npm run client:build    # Build frontend for production
npm start              # Start backend server
```

## Configuration

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=5000
```

Create a `.env` file in the `/client` directory:

```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### "Repository not found"
- Ensure the URL is correct
- Verify the repository is public
- Check your internet connection

### "Failed to clone repository"
- Ensure Git is installed (`git --version`)
- Check firewall/proxy settings

### Frontend can't connect to backend
- Verify both servers are running
- Check that backend is on port 5000
- Look for CORS errors in console

### Large repositories are slow
- This is expected - cloning and analyzing takes time
- Consider using smaller repos for testing
- Phase 2 will include optimizations

## Roadmap

### ✅ Phase 0: Local-First MVP (COMPLETE)
- Local analyzer script
- 3D visualization frontend
- Proof of concept

### ✅ Phase 1: Public Web Service (COMPLETE)
- Express backend with GitHub integration
- Landing page with URL input
- Automatic cloning and analysis
- Public web deployment ready

### 🚧 Phase 2: Refinement & Interactivity (NEXT)
- Advanced filtering (by role, language)
- File search functionality
- Better force-directed layout algorithms
- Performance optimizations for large repos
- Caching layer
- Progress indicators
- File content viewer with syntax highlighting

### 🔮 Phase 3: Future Vision
- Dynamic flow analysis (trace function calls)
- AI error explainer (paste stack trace, see affected files)
- Private repo support (GitHub OAuth)
- Team collaboration features
- Code change visualization (git diffs)
- OpenAI API integration for smarter analysis

## Technology Stack

**Analysis Engine:**
- Node.js
- simple-git (Git operations)

**Backend:**
- Express.js
- CORS middleware

**Frontend:**
- React 18
- Vite (build tool)
- Three.js (3D graphics)
- react-three-fiber (React renderer for Three.js)
- @react-three/drei (helpers & components)

**Languages Supported:**
- 20+ programming languages

## Performance

- **Small repos (<50 files)**: 2-5 seconds
- **Medium repos (50-500 files)**: 5-30 seconds
- **Large repos (500+ files)**: 30+ seconds

Shallow cloning (`--depth 1`) significantly improves performance.

## Contributing

Contributions are welcome! This is an active project with more phases planned.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (both Phase 0 and Phase 1 modes)
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

Built with curiosity by developers, for developers.

**Founder:** Haig (Walaw Studio)

---

### Want to Deploy?

Phase 1 is deployment-ready! Deploy to:
- **Frontend**: Vercel, Netlify, or any static host
- **Backend**: Railway, Render, Heroku, or VPS

Set environment variables accordingly and you're live!
