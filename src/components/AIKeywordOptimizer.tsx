import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { aiResumeService } from '../lib/ai-resume';

interface AIKeywordOptimizerProps {
  resumeData: any;
  onUpdateContent: (section: string, content: string) => void;
}

interface KeywordAnalysis {
  currentKeywords: string[];
  missingKeywords: string[];
  keywordDensity: { [key: string]: number };
  suggestions: string[];
  score: number;
}

const AIKeywordOptimizer: React.FC<AIKeywordOptimizerProps> = ({
  resumeData,
  onUpdateContent
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [apiKeyError, setApiKeyError] = useState(false);

  const extractKeywords = async () => {
    if (!jobDescription.trim()) return;

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    setIsExtracting(true);
    setError(null);
    setApiKeyError(false);

    try {
      const keywords = await aiResumeService.extractKeywordsFromJobDescription(jobDescription);
      setExtractedKeywords(keywords);
    } catch (err) {
      setError('Failed to extract keywords from job description');
    } finally {
      setIsExtracting(false);
    }
  };

  const analyzeKeywords = async () => {
    if (!extractedKeywords.length) {
      setError('Please extract keywords first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const resumeText = JSON.stringify(resumeData);
      const currentKeywords: string[] = [];
      const missingKeywords: string[] = [];
      const keywordDensity: { [key: string]: number } = {};

      // Analyze current keywords in resume
      extractedKeywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = resumeText.match(regex);
        const count = matches ? matches.length : 0;
        
        keywordDensity[keyword] = count;
        
        if (count > 0) {
          currentKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });

      // Calculate score
      const score = Math.round((currentKeywords.length / extractedKeywords.length) * 100);

      // Generate suggestions
      const suggestions = [];
      if (missingKeywords.length > 0) {
        suggestions.push(`Add these missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
      }
      if (currentKeywords.length < extractedKeywords.length * 0.7) {
        suggestions.push('Consider adding more industry-relevant keywords');
      }
      if (Object.values(keywordDensity).some(density => density > 5)) {
        suggestions.push('Some keywords appear too frequently - consider natural variation');
      }

      setAnalysis({
        currentKeywords,
        missingKeywords,
        keywordDensity,
        suggestions,
        score
      });
    } catch (err) {
      setError('Failed to analyze keywords');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeSection = async (section: string) => {
    if (!analysis || !extractedKeywords.length) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const jobDesc = {
        title: 'Target Position',
        company: 'Target Company',
        description: jobDescription,
        requirements: extractedKeywords.slice(0, 10),
        keywords: extractedKeywords
      };

      let currentContent = '';
      switch (section) {
        case 'summary':
          currentContent = resumeData.professionalSummary || '';
          break;
        case 'experience':
          currentContent = JSON.stringify(resumeData.workExperience || []);
          break;
        case 'skills':
          currentContent = JSON.stringify(resumeData.skills || []);
          break;
        default:
          return;
      }

      const result = await aiResumeService.optimizeResumeSection(
        {
          title: section,
          content: currentContent,
          type: section as any
        },
        jobDesc
      );

      onUpdateContent(section, result.optimizedContent);
    } catch (err) {
      setError('Failed to optimize section');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const copyKeywords = () => {
    navigator.clipboard.writeText(extractedKeywords.join(', '));
  };

  if (apiKeyError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TagIcon className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Keyword Optimizer</h2>
        </div>
        
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">API Key Required</h3>
              <p className="text-yellow-700 mt-1">
                To use AI keyword optimization features, you need to set up your OpenAI API key.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <TagIcon className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Keyword Optimizer</h2>
      </div>

      {/* Job Description Input */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Target Job Description
        </h3>
        
        <div className="mb-4">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description here to extract relevant keywords..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={extractKeywords}
            disabled={isExtracting || !jobDescription.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isExtracting ? 'animate-spin' : ''}`} />
            Extract Keywords
          </button>
          
          <button
            onClick={analyzeKeywords}
            disabled={isAnalyzing || !extractedKeywords.length}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <SparklesIcon className={`h-4 w-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            Analyze Resume
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Extracted Keywords */}
      {extractedKeywords.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Extracted Keywords</h3>
            <button
              onClick={copyKeywords}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 flex items-center gap-1"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              Copy All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {extractedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Keyword Analysis</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
              Score: {analysis.score}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                Found Keywords ({analysis.currentKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysis.currentKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Missing Keywords ({analysis.missingKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {analysis.missingKeywords.slice(0, 10).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
                {analysis.missingKeywords.length > 10 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{analysis.missingKeywords.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <StarIcon className="h-5 w-5" />
                Optimization Suggestions
              </h4>
              <ul className="space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-700">• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Section Optimization */}
      {analysis && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Optimize Resume Sections</h3>
          
          <div className="space-y-3">
            {['summary', 'experience', 'skills'].map((section) => (
              <div key={section} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium capitalize">{section} Section</h4>
                    <p className="text-sm text-gray-600">
                      Optimize this section with relevant keywords
                    </p>
                  </div>
                  <button
                    onClick={() => optimizeSection(section)}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    Optimize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIKeywordOptimizer;
