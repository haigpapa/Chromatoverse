import { explainError } from './ai-analyzer.js';

// Vercel Serverless Function Handler for Error Explanation
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
    console.log(`[Vercel] Explaining error...`);
    const explanation = await explainError(errorTrace, files);

    if (explanation.error) {
      return res.status(503).json({
        error: 'AI analysis not available',
        details: explanation.error
      });
    }

    res.json(explanation);
  } catch (error) {
    console.error(`[Vercel] Error explaining error:`, error.message);
    res.status(500).json({
      error: 'Failed to explain error',
      details: error.message
    });
  }
}
