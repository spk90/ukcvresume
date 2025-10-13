import React, { useState, useEffect, useCallback } from 'react';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AIRealTimeFeedbackProps {
  content: string;
  sectionType: 'summary' | 'experience' | 'skills' | 'education';
  jobTitle?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

interface AISuggestion {
  id: string;
  type: 'improvement' | 'keyword' | 'grammar' | 'format';
  message: string;
  suggestion: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

const AIRealTimeFeedback: React.FC<AIRealTimeFeedbackProps> = ({
  content,
  sectionType,
  jobTitle,
  onSuggestionApply
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState('');
  const [apiKeyError, setApiKeyError] = useState(false);

  // Debounced analysis function
  const analyzeContent = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 20) {
      setSuggestions([]);
      return;
    }

    if (text === lastAnalyzedContent) return;

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      setApiKeyError(true);
      return;
    }

    setIsAnalyzing(true);
    setLastAnalyzedContent(text);
    setApiKeyError(false);

    try {
      // Create a mock job description for analysis
      const mockJobDescription = {
        title: jobTitle || 'Software Engineer',
        company: 'Target Company',
        description: 'Looking for a skilled professional with relevant experience.',
        requirements: ['communication', 'teamwork', 'problem-solving'],
        keywords: ['leadership', 'innovation', 'results-driven', 'collaboration']
      };

      // Analyze the content based on section type
      let analysisPrompt = '';
      
      switch (sectionType) {
        case 'summary':
          analysisPrompt = `
Analyze this professional summary and provide real-time feedback:

"${text}"

Provide 3-5 specific suggestions for improvement in JSON format:
{
  "suggestions": [
    {
      "type": "improvement|keyword|grammar|format",
      "message": "Brief description of the issue",
      "suggestion": "Specific improvement suggestion",
      "confidence": 0.8,
      "priority": "high|medium|low"
    }
  ]
}

Focus on:
- Clarity and impact
- Keyword optimization
- Professional tone
- Quantifiable achievements
- ATS compatibility
`;
          break;
        
        case 'experience':
          analysisPrompt = `
Analyze this work experience description and provide feedback:

"${text}"

Provide suggestions for improvement in JSON format:
{
  "suggestions": [
    {
      "type": "improvement|keyword|grammar|format",
      "message": "Brief description of the issue",
      "suggestion": "Specific improvement suggestion",
      "confidence": 0.8,
      "priority": "high|medium|low"
    }
  ]
}

Focus on:
- Action verbs and quantifiable results
- STAR method (Situation, Task, Action, Result)
- Relevant keywords
- Professional achievements
`;
          break;
        
        case 'skills':
          analysisPrompt = `
Analyze these skills and provide optimization suggestions:

"${text}"

Provide suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "improvement|keyword|grammar|format",
      "message": "Brief description of the issue",
      "suggestion": "Specific improvement suggestion",
      "confidence": 0.8,
      "priority": "high|medium|low"
    }
  ]
}

Focus on:
- Industry-relevant skills
- Technical vs soft skills balance
- Keyword optimization
- Skill categorization
`;
          break;
        
        default:
          analysisPrompt = `
Analyze this content and provide improvement suggestions:

"${text}"

Provide suggestions in JSON format:
{
  "suggestions": [
    {
      "type": "improvement|keyword|grammar|format",
      "message": "Brief description of the issue",
      "suggestion": "Specific improvement suggestion",
      "confidence": 0.8,
      "priority": "high|medium|low"
    }
  ]
}
`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: analysisPrompt }],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI feedback');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      const newSuggestions: AISuggestion[] = result.suggestions.map((s: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        type: s.type,
        message: s.message,
        suggestion: s.suggestion,
        confidence: s.confidence,
        priority: s.priority
      }));

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('AI analysis error:', error);
      setSuggestions([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, sectionType, jobTitle, lastAnalyzedContent]);

  // Debounce the analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeContent(content);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [content, analyzeContent]);

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion.suggestion);
    }
    // Remove the applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <LightBulbIcon className="h-4 w-4 text-blue-500" />;
      case 'keyword':
        return <SparklesIcon className="h-4 w-4 text-purple-500" />;
      case 'grammar':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'format':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <LightBulbIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (apiKeyError) {
    return (
      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <div>
            <p className="font-medium">AI features require API key</p>
            <p className="text-sm">Set REACT_APP_OPENAI_API_KEY in your .env file to enable AI suggestions</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showSuggestions || suggestions.length === 0) {
    return (
      <div className="mt-4">
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            AI is analyzing your content...
          </div>
        )}
        {!isAnalyzing && content.length > 20 && (
          <button
            onClick={() => setShowSuggestions(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <SparklesIcon className="h-4 w-4" />
            Show AI suggestions
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <h4 className="text-sm font-semibold text-gray-900">AI Suggestions</h4>
          {isAnalyzing && (
            <ArrowPathIcon className="h-4 w-4 animate-spin text-gray-500" />
          )}
        </div>
        <button
          onClick={() => setShowSuggestions(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {suggestion.message}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    {suggestion.suggestion}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(suggestion.confidence * 100)}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
                <button
                  onClick={() => dismissSuggestion(suggestion.id)}
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRealTimeFeedback;
