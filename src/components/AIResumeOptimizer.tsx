import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  DocumentTextIcon, 
  LightBulbIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { aiResumeService, JobDescription, ResumeAnalysis, AIOptimizationResult } from '../lib/ai-resume';
import AIKeywordOptimizer from './AIKeywordOptimizer';

interface AIResumeOptimizerProps {
  resumeData: any;
  onOptimizeSection: (sectionType: string, optimizedContent: string) => void;
  onUpdateSummary: (newSummary: string) => void;
}

const AIResumeOptimizer: React.FC<AIResumeOptimizerProps> = ({
  resumeData,
  onOptimizeSection,
  onUpdateSummary
}) => {
  const [jobDescription, setJobDescription] = useState<JobDescription>({
    title: '',
    company: '',
    description: '',
    requirements: [],
    keywords: []
  });
  
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<{[key: string]: AIOptimizationResult}>({});
  const [activeTab, setActiveTab] = useState<'analysis' | 'optimize' | 'keywords'>('analysis');
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);

  const handleJobDescriptionChange = (field: keyof JobDescription, value: any) => {
    setJobDescription(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const extractKeywords = async () => {
    if (!jobDescription.description) return;
    
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setApiKeyError(false);
    
    try {
      const keywords = await aiResumeService.extractKeywordsFromJobDescription(jobDescription.description);
      setJobDescription(prev => ({
        ...prev,
        keywords
      }));
    } catch (err) {
      setError('Failed to extract keywords');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeResume = async () => {
    if (!jobDescription.title || !jobDescription.description) {
      setError('Please provide job title and description');
      return;
    }

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setApiKeyError(false);

    try {
      const result = await aiResumeService.analyzeResume(resumeData, jobDescription);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (err) {
      setError('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeSection = async (sectionType: string, content: string) => {
    setIsOptimizing(true);
    setError(null);

    try {
      const result = await aiResumeService.optimizeResumeSection(
        {
          title: sectionType,
          content,
          type: sectionType as any
        },
        jobDescription
      );

      setOptimizationResults(prev => ({
        ...prev,
        [sectionType]: result
      }));
    } catch (err) {
      setError('Failed to optimize section');
    } finally {
      setIsOptimizing(false);
    }
  };

  const optimizeSummary = async () => {
    if (!resumeData.summary) return;

    setIsOptimizing(true);
    setError(null);

    try {
      const optimizedSummary = await aiResumeService.generateTailoredSummary(
        resumeData.summary,
        jobDescription
      );
      onUpdateSummary(optimizedSummary);
    } catch (err) {
      setError('Failed to optimize summary');
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = (sectionType: string) => {
    const result = optimizationResults[sectionType];
    if (result) {
      onOptimizeSection(sectionType, result.optimizedContent);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (apiKeyError) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <SparklesIcon className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Resume Optimizer</h2>
        </div>
        
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">API Key Required</h3>
              <p className="text-yellow-700 mt-1">
                To use AI resume optimization features, you need to set up your OpenAI API key.
              </p>
              <div className="mt-3">
                <p className="text-sm text-yellow-600">
                  1. Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
                </p>
                <p className="text-sm text-yellow-600">
                  2. Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in your project root
                </p>
                <p className="text-sm text-yellow-600">
                  3. Add: <code className="bg-yellow-100 px-1 rounded">REACT_APP_OPENAI_API_KEY=your_key_here</code>
                </p>
                <p className="text-sm text-yellow-600">
                  4. Restart your development server
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <SparklesIcon className="h-8 w-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Resume Optimizer</h2>
      </div>

      {/* Job Description Input */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5" />
          Target Job Description
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={jobDescription.title}
              onChange={(e) => handleJobDescriptionChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={jobDescription.company}
              onChange={(e) => handleJobDescriptionChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Google, Microsoft"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            value={jobDescription.description}
            onChange={(e) => handleJobDescriptionChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Paste the complete job description here..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={extractKeywords}
            disabled={isAnalyzing || !jobDescription.description}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Extract Keywords
          </button>
          
          <button
            onClick={analyzeResume}
            disabled={isAnalyzing || !jobDescription.title || !jobDescription.description}
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

      {/* Keywords Display */}
      {jobDescription.keywords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Extracted Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {jobDescription.keywords.map((keyword, index) => (
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

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <SparklesIcon className="h-4 w-4 inline mr-2" />
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'optimize'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LightBulbIcon className="h-4 w-4 inline mr-2" />
            Optimize
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'keywords'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TagIcon className="h-4 w-4 inline mr-2" />
            Keywords
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {activeTab === 'analysis' && analysis && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Resume Analysis</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(analysis.overallScore)} ${getScoreColor(analysis.overallScore)}`}>
              Score: {analysis.overallScore}/10
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-700">• {strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-gray-700">• {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <LightBulbIcon className="h-5 w-5" />
              Recommendations
            </h4>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-700">• {rec}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analysis.keywordMatch}%</div>
              <div className="text-sm text-gray-600">Keyword Match</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analysis.atsCompatibility}/10</div>
              <div className="text-sm text-gray-600">ATS Compatibility</div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Section */}
      {activeTab === 'optimize' && analysis && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Optimize Resume Sections</h3>
          
          <div className="space-y-4">
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Experience Section</h4>
                  <button
                    onClick={() => optimizeSection('experience', JSON.stringify(resumeData.experience))}
                    disabled={isOptimizing}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    Optimize
                  </button>
                </div>
                
                {optimizationResults.experience && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Optimization Score: {optimizationResults.experience.score}/10</span>
                      <button
                        onClick={() => applyOptimization('experience')}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      <strong>Improvements:</strong> {optimizationResults.experience.improvements.join(', ')}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Keywords Added:</strong> {optimizationResults.experience.keywordsAdded.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {resumeData.summary && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Professional Summary</h4>
                  <button
                    onClick={optimizeSummary}
                    disabled={isOptimizing}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    Optimize
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <AIKeywordOptimizer
          resumeData={resumeData}
          onUpdateContent={onOptimizeSection}
        />
      )}
    </div>
  );
};

export default AIResumeOptimizer;
