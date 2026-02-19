import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { Copy, Check } from 'lucide-react';
import { generateText } from '@/services/ai';

interface SocialToolProps {
  toolId: string;
}

const titleStyleOptions = [
  { value: 'clickbait', label: 'Very Clickbait' },
  { value: 'professional', label: 'Professional but Catchy' },
  { value: 'simple', label: 'Simple and Clear' },
];

const videoTypeOptions = [
  { value: 'educational', label: 'Educational' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'review', label: 'Review' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'vlog', label: 'Vlog Style' },
];

const videoLengthOptions = [
  { value: 'short', label: 'Short Video (Under 5 min)' },
  { value: 'medium', label: '5-10 Minutes' },
  { value: 'long', label: '10-20 Minutes' },
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'bangla', label: 'Bangla' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
];

export function YouTubeTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('clickbait');
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setTitles([]);
    
    const styleText = titleStyleOptions.find(o => o.value === style)?.label || style;
    
    const prompt = `Generate 6 ${styleText} YouTube video titles for: "${topic}"

Requirements:
- Make them attention-grabbing and click-worthy
- Each title should be unique and different
- Keep them under 60 characters ideally
- Do NOT use asterisks or single quotes
- Make them optimized for YouTube search
- Return ONLY the 6 titles, one per line, numbered 1-6`;

    const { error: apiError, output } = await generateText(prompt);
    
    if (apiError) {
      setError(apiError);
    } else {
      const lines = output.split('\n')
        .map(line => line.replace(/^\\d+[\\.\\)]\\s*/, '').trim())
        .filter(line => line.length > 0 && !line.toLowerCase().includes('here are'));
      setTitles(lines.slice(0, 6));
    }
    setLoading(false);
  };

  const copyTitle = async (title: string, index: number) => {
    await navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(titles.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Input
          label="Topic or Current Title"
          placeholder="Enter your video topic or a weak title you want to improve"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Select label="Style" options={titleStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Titles
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Generated Titles</span>
          {titles.length > 0 && (
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              {copiedIndex === -1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All
            </button>
          )}
        </div>
        
        <div className="p-4 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Generating titles...</span>
              </div>
            </div>
          ) : titles.length > 0 ? (
            <div className="space-y-3">
              {titles.map((title, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg group"
                >
                  <span className="text-slate-200 flex-1">{title}</span>
                  <button
                    onClick={() => copyTitle(title, index)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors"
                  >
                    {copiedIndex === index ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              Generated titles will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function YouTubeScriptWriter() {
  const [topic, setTopic] = useState('');
  const [videoType, setVideoType] = useState('educational');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const typeLabel = videoTypeOptions.find(o => o.value === videoType)?.label || videoType;
    const lengthLabel = videoLengthOptions.find(o => o.value === length)?.label || length;
    
    const prompt = `Write a complete YouTube video script for a ${typeLabel} video about: "${topic}"

Target length: ${lengthLabel}

Include these sections:
1. HOOK/INTRO - Grab attention in first 5 seconds
2. INTRODUCTION - Introduce the topic and yourself
3. MAIN CONTENT - Detailed content with clear segments
4. CALL TO ACTION - Ask viewers to like, subscribe, comment
5. OUTRO - End the video professionally

Requirements:
- Make section headings clear and prominent
- Include speaker cues like [PAUSE], [SHOW ON SCREEN], [B-ROLL] where appropriate
- Write in a conversational, engaging tone
- Do NOT use hash symbols, asterisks, or single quotes
- Make the script ready for recording

Respond with only the script.`;

    const { error: apiError, output } = await generateText(prompt);
    
    if (apiError) {
      setError(apiError);
    } else {
      setResult(output);
    }
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <TextArea
          label="Video Topic and Details"
          placeholder="Describe your video topic, target audience, and any special instructions. You can specify language like 'write in Bangla' or 'make it funny'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Video Type" options={videoTypeOptions} value={videoType} onChange={(e) => setVideoType(e.target.value)} />
        <Select label="Video Length" options={videoLengthOptions} value={length} onChange={(e) => setLength(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Script
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function YouTubeDescriptionGenerator() {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Create an SEO-friendly YouTube description for a video titled: "${title}"

${keywords ? `Keywords/Audience: ${keywords}` : ''}

Requirements:
- First 2 sentences should be compelling (shown in search results)
- Include a clear summary of video content
- Add a timestamps section placeholder
- Include call to action (subscribe, like, comment)
- Add social media links placeholder section
- End with 5-8 relevant hashtags
- Make it professional and engaging
- Do NOT use asterisks or single quotes in the description

Respond with only the description including hashtags.`;

    const { error: apiError, output } = await generateText(prompt);
    
    if (apiError) {
      setError(apiError);
    } else {
      setResult(output);
    }
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Input
          label="Video Title"
          placeholder="Paste your final video title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Keywords / Target Audience (Optional)"
          placeholder="Main keywords or target audience, e.g., fitness, beginners, cooking tips"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!title.trim()}>
          Generate Description
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function YouTubeTagGenerator() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('english');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    setTags([]);
    
    const prompt = `Generate 20-25 SEO-friendly YouTube tags for a video about: "${title}"

Language for tags: ${language}

Requirements:
- Mix of broad and specific tags
- Include trending related terms
- Include both short and long-tail keywords
- No special characters except necessary ones
- Return ONLY the tags, comma-separated on one line
- Do NOT use asterisks, hash symbols, or single quotes`;

    const { error: apiError, output } = await generateText(prompt);
    
    if (apiError) {
      setError(apiError);
    } else {
      const tagList = output.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && tag.length < 100);
      setTags(tagList);
    }
    setLoading(false);
  };

  const copyTags = async () => {
    await navigator.clipboard.writeText(tags.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Input
          label="Video Title or Keywords"
          placeholder="Enter your video title or main keywords"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select label="Tags Language" options={languageOptions} value={language} onChange={(e) => setLanguage(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!title.trim()}>
          Generate Tags
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Generated Tags</span>
          {tags.length > 0 && (
            <button
              onClick={copyTags}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy All Tags
            </button>
          )}
        </div>
        
        <div className="p-4 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Generating tags...</span>
              </div>
            </div>
          ) : tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              Generated tags will appear here as pills
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SocialToolWrapper({ toolId }: SocialToolProps) {
  switch (toolId) {
    case 'youtube-title':
      return <YouTubeTitleGenerator />;
    case 'youtube-script':
      return <YouTubeScriptWriter />;
    case 'youtube-description':
      return <YouTubeDescriptionGenerator />;
    case 'youtube-tags':
      return <YouTubeTagGenerator />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}
