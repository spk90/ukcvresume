// AI Resume Tailoring Service
// Uses OpenAI GPT-3.5-turbo for intelligent resume optimization

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ResumeSection {
  title: string;
  content: string;
  type: 'experience' | 'education' | 'skills' | 'summary' | 'projects';
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface AIOptimizationResult {
  originalContent: string;
  optimizedContent: string;
  improvements: string[];
  keywordsAdded: string[];
  score: number;
  suggestions: string[];
}

export interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywordMatch: number;
  atsCompatibility: number;
}

class AIResumeService {
  private async callOpenAI(messages: any[], maxTokens: number = 1000): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY in your .env file.');
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get AI optimization. Please check your API key and try again.');
    }
  }

  async optimizeResumeSection(
    section: ResumeSection,
    jobDescription: JobDescription
  ): Promise<AIOptimizationResult> {
    const prompt = `
You are an expert resume writer and career coach. Optimize this resume section for the specific job.

RESUME SECTION:
Title: ${section.title}
Type: ${section.type}
Content: ${section.content}

JOB DESCRIPTION:
Title: ${jobDescription.title}
Company: ${jobDescription.company}
Description: ${jobDescription.description}
Requirements: ${jobDescription.requirements.join(', ')}
Keywords: ${jobDescription.keywords.join(', ')}

Please provide:
1. OPTIMIZED_CONTENT: Rewrite the content to better match the job requirements
2. IMPROVEMENTS: List 3-5 specific improvements made
3. KEYWORDS_ADDED: List keywords from the job description that were incorporated
4. SCORE: Rate the optimization quality (1-10)
5. SUGGESTIONS: Additional recommendations for this section

Format your response as JSON:
{
  "optimizedContent": "...",
  "improvements": ["...", "..."],
  "keywordsAdded": ["...", "..."],
  "score": 8,
  "suggestions": ["...", "..."]
}
`;

    try {
      const response = await this.callOpenAI([
        { role: 'user', content: prompt }
      ], 1500);

      const result = JSON.parse(response);
      return {
        originalContent: section.content,
        optimizedContent: result.optimizedContent,
        improvements: result.improvements,
        keywordsAdded: result.keywordsAdded,
        score: result.score,
        suggestions: result.suggestions,
      };
    } catch (error) {
      throw new Error('Failed to optimize resume section');
    }
  }

  async analyzeResume(resumeData: any, jobDescription: JobDescription): Promise<ResumeAnalysis> {
    const prompt = `
Analyze this resume against the job description and provide comprehensive feedback.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
Title: ${jobDescription.title}
Company: ${jobDescription.company}
Description: ${jobDescription.description}
Requirements: ${jobDescription.requirements.join(', ')}
Keywords: ${jobDescription.keywords.join(', ')}

Provide analysis in JSON format:
{
  "overallScore": 7,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendations": ["...", "..."],
  "keywordMatch": 75,
  "atsCompatibility": 8
}

Consider:
- Keyword matching percentage
- ATS compatibility (1-10)
- Overall fit for the role
- Specific strengths and weaknesses
- Actionable recommendations
`;

    try {
      const response = await this.callOpenAI([
        { role: 'user', content: prompt }
      ], 2000);

      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to analyze resume');
    }
  }

  async generateTailoredSummary(
    currentSummary: string,
    jobDescription: JobDescription
  ): Promise<string> {
    const prompt = `
Rewrite this professional summary to perfectly match the job requirements:

CURRENT SUMMARY:
${currentSummary}

JOB DESCRIPTION:
Title: ${jobDescription.title}
Company: ${jobDescription.company}
Description: ${jobDescription.description}
Requirements: ${jobDescription.requirements.join(', ')}
Keywords: ${jobDescription.keywords.join(', ')}

Create a compelling 3-4 sentence summary that:
- Highlights relevant experience
- Incorporates key job requirements
- Uses industry keywords
- Shows value proposition
- Maintains professional tone

Return only the optimized summary text.
`;

    try {
      return await this.callOpenAI([
        { role: 'user', content: prompt }
      ], 500);
    } catch (error) {
      throw new Error('Failed to generate tailored summary');
    }
  }

  async suggestBulletPoints(
    experience: string,
    jobDescription: JobDescription
  ): Promise<string[]> {
    const prompt = `
Generate 3-5 powerful bullet points for this work experience that match the job requirements:

EXPERIENCE:
${experience}

JOB DESCRIPTION:
Title: ${jobDescription.title}
Company: ${jobDescription.company}
Description: ${jobDescription.description}
Requirements: ${jobDescription.requirements.join(', ')}
Keywords: ${jobDescription.keywords.join(', ')}

Create bullet points that:
- Use action verbs
- Include quantifiable results
- Match job requirements
- Incorporate relevant keywords
- Follow STAR method (Situation, Task, Action, Result)

Return as a JSON array of strings:
["bullet point 1", "bullet point 2", "bullet point 3"]
`;

    try {
      const response = await this.callOpenAI([
        { role: 'user', content: prompt }
      ], 800);

      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to generate bullet points');
    }
  }

  async extractKeywordsFromJobDescription(jobDescription: string): Promise<string[]> {
    const prompt = `
Extract the most important keywords and skills from this job description:

${jobDescription}

Return a JSON array of the top 15-20 most relevant keywords/skills:
["keyword1", "keyword2", "keyword3", ...]

Focus on:
- Technical skills
- Software/tools
- Certifications
- Industry terms
- Soft skills
- Experience levels
`;

    try {
      const response = await this.callOpenAI([
        { role: 'user', content: prompt }
      ], 500);

      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to extract keywords');
    }
  }
}

export const aiResumeService = new AIResumeService();
