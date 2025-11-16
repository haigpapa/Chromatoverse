import OpenAI from 'openai';

// Initialize OpenAI client (optional - falls back to mock if no key)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Analyzes a file using OpenAI GPT-4
 * Returns: { language, role, summary, dependencies, insights }
 */
export async function analyzeFileWithAI(file) {
  if (!openai) {
    // Fallback to mock analysis if no API key
    return null;
  }

  try {
    const prompt = `Analyze this code file and provide a JSON response with the following structure:
{
  "language": "The programming language (e.g., JavaScript, Python, TypeScript)",
  "role": "Pick ONE from: UI Component, Styling, API Service, Utility, State Management, Routing, Configuration, Testing, Documentation, Other",
  "summary": "A concise one-sentence summary (max 15 words) of what this file does",
  "keyFunctions": "Brief list of 2-3 main functions/exports (if applicable)",
  "complexity": "Rate as: Simple, Moderate, or Complex",
  "insights": "One brief insight about code quality, patterns, or potential improvements (optional, 1 sentence)"
}

File: ${file.path}

Code:
\`\`\`
${file.content.slice(0, 3000)}
\`\`\`

Return ONLY valid JSON, no other text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a code analysis expert. Analyze code files and provide structured insights. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content.trim();
    const analysis = JSON.parse(response);

    return {
      language: analysis.language || 'Unknown',
      role: analysis.role || 'Other',
      summary: analysis.summary || 'Code file',
      keyFunctions: analysis.keyFunctions || null,
      complexity: analysis.complexity || 'Unknown',
      insights: analysis.insights || null
    };

  } catch (error) {
    console.error(`AI analysis error for ${file.path}:`, error.message);
    return null; // Fall back to mock
  }
}

/**
 * Generates project-level insights using OpenAI
 */
export async function generateProjectInsights(files, projectAnalysis) {
  if (!openai) {
    return null;
  }

  try {
    const fileList = files.slice(0, 50).map(f => ({
      path: f.path,
      role: f.role,
      language: f.language
    }));

    const prompt = `Analyze this software project and provide insights.

Project: ${projectAnalysis.projectName}
File Count: ${projectAnalysis.fileCount}
Languages: ${projectAnalysis.languages.join(', ')}

Sample Files:
${JSON.stringify(fileList, null, 2)}

Provide a JSON response:
{
  "architecture": "Brief description of the project's architecture (1 sentence)",
  "strengths": "2-3 key strengths of the codebase",
  "suggestions": "2-3 suggestions for improvement",
  "techStack": "Identified technologies and frameworks"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a software architecture expert. Analyze projects and provide actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 400,
    });

    const response = completion.choices[0].message.content.trim();
    const insights = JSON.parse(response);

    return insights;

  } catch (error) {
    console.error('Project insights error:', error.message);
    return null;
  }
}

/**
 * AI Error Explainer - analyzes error stack traces
 */
export async function explainError(errorTrace, files) {
  if (!openai) {
    return { error: 'OpenAI API key not configured' };
  }

  try {
    const fileList = files.map(f => f.path).join('\n');

    const prompt = `Analyze this error stack trace and identify which files are likely involved.

Error:
\`\`\`
${errorTrace}
\`\`\`

Available files in project:
${fileList}

Provide JSON response:
{
  "errorType": "Type of error (e.g., Runtime Error, Type Error)",
  "likelyFiles": ["array", "of", "file", "paths"],
  "explanation": "Brief explanation of what might be causing this error",
  "suggestions": "Suggested fix or where to look"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a debugging expert. Analyze error traces and identify relevant files.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    const response = completion.choices[0].message.content.trim();
    const explanation = JSON.parse(response);

    return explanation;

  } catch (error) {
    console.error('Error explanation error:', error.message);
    return { error: error.message };
  }
}
