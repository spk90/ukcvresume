# AI Resume Tailoring Setup Guide

## OpenAI API Key Configuration

To use the AI resume tailoring features, you need to set up your OpenAI API key.

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the generated API key

### Step 2: Configure the API Key

Create a `.env` file in the root directory of your project:

```bash
# .env file
REACT_APP_OPENAI_API_KEY=your_actual_api_key_here
```

**Important:** 
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Replace `your_actual_api_key_here` with your real API key

### Step 3: Restart the Development Server

After adding the API key, restart your development server:

```bash
npm start
```

## Features Available with AI Integration

### 🤖 AI Resume Optimizer
- **Job Description Analysis**: Paste any job description to get tailored suggestions
- **Resume Scoring**: Get an overall score and detailed feedback
- **Section Optimization**: Optimize individual resume sections
- **ATS Compatibility**: Check how well your resume passes ATS systems

### 🎯 Real-time AI Feedback
- **Live Suggestions**: Get suggestions as you type in the professional summary
- **Smart Recommendations**: AI analyzes your content and provides improvements
- **Confidence Scoring**: Each suggestion comes with a confidence level
- **Priority Levels**: Suggestions are categorized by importance

### 🔍 AI Keyword Optimizer
- **Keyword Extraction**: Automatically extract keywords from job descriptions
- **Keyword Analysis**: See which keywords you have and which you're missing
- **Density Analysis**: Check keyword frequency and distribution
- **Optimization Suggestions**: Get specific recommendations for improvement

## Usage Tips

1. **Start with Job Description**: Always paste the target job description first
2. **Extract Keywords**: Use the keyword extraction feature to identify important terms
3. **Analyze Your Resume**: Get a comprehensive analysis of your current resume
4. **Apply Suggestions**: Use the one-click optimization features
5. **Review Changes**: Always review AI suggestions before applying them

## Cost Considerations

- OpenAI GPT-3.5-turbo costs approximately $0.01-0.06 per 1K tokens
- Typical resume optimization uses 500-2000 tokens
- Estimated cost per optimization: $0.005-0.12
- Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## Troubleshooting

### API Key Not Working
- Ensure your API key is correctly set in the `.env` file
- Restart the development server after adding the API key
- Check that your OpenAI account has sufficient credits

### No AI Suggestions
- Verify your API key is valid and active
- Check your internet connection
- Ensure you have sufficient OpenAI credits

### Slow Response Times
- AI analysis can take 2-5 seconds depending on content length
- Large job descriptions may take longer to process
- Consider breaking down very long content into smaller sections

## Security Notes

- Your API key is stored locally and never sent to our servers
- All AI processing happens directly with OpenAI
- Resume data is only sent to OpenAI for analysis and is not stored
- Always use environment variables for API keys in production
