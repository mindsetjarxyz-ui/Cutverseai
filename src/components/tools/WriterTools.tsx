import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { generateText } from '@/services/ai';

interface WriterToolProps {
  toolId: string;
}

const contentTypeOptions = [
  { value: 'kids-story', label: 'Kids Story' },
  { value: 'blog-post', label: 'Blog Post' },
  { value: 'instagram-caption', label: 'Instagram Caption' },
  { value: 'product-description', label: 'Product Description' },
  { value: 'email', label: 'Email' },
  { value: 'social-media', label: 'Social Media Post' },
];

const ageGroupOptions = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

const blogToneOptions = [
  { value: 'informative', label: 'Informative' },
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'entertaining', label: 'Entertaining' },
];

const captionStyleOptions = [
  { value: 'engaging', label: 'Engaging' },
  { value: 'funny', label: 'Funny' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'promotional', label: 'Promotional' },
];

export function ContentWriter() {
  const [contentType, setContentType] = useState('blog-post');
  const [details, setDetails] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    setError('');
    
    const typeLabel = contentTypeOptions.find(o => o.value === contentType)?.label || contentType;
    
    const prompt = `Write a ${typeLabel} based on these details:

${details}

Requirements:
- Create high-quality, engaging content
- Make the title/heading prominent
- Use appropriate tone and style for ${typeLabel}
- Do NOT use hash symbols, asterisks, or single quotes in the main text
- For Instagram captions, include relevant hashtags at the end
- Make it well-structured and professional

Respond with only the content.`;

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
        <Select 
          label="Content Type" 
          options={contentTypeOptions} 
          value={contentType} 
          onChange={(e) => setContentType(e.target.value)} 
        />
        <TextArea
          label="Details and Instructions"
          placeholder="Describe what you want to write about. Include topic, tone, target audience, and any specific requirements. You can specify language like 'write in Hindi'."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={8}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!details.trim()}>
          Generate Content
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function KidsStoryWriter() {
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('6-8');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write an engaging children story for ages ${ageGroup} about: "${topic}"

Requirements:
- Create a catchy, fun title
- Use age-appropriate vocabulary and sentence length
- Include colorful descriptions and lovable characters
- Make it imaginative and engaging
- Include a positive message or moral at the end
- Do NOT use hash symbols, asterisks, or single quotes
- Make key story moments exciting

Respond with only the story with its title.`;

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
          label="Story Topic"
          placeholder="What should the story be about? E.g., A brave little rabbit, A magical adventure, Friendship between a cat and dog, A trip to the moon..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Age Group" options={ageGroupOptions} value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Story
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function BlogPostWriter() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('informative');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write an SEO-friendly blog post about: "${topic}"

Tone: ${tone}

Requirements:
- Create a catchy headline/title
- Write an engaging introduction with a hook
- Structure the body with clear subheadings
- Include practical tips, insights, or information
- End with a strong conclusion and call-to-action
- Use ${tone} tone throughout
- Do NOT use hash symbols, asterisks, or single quotes
- Make headings and key points prominent

Respond with the complete blog post.`;

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
          label="Blog Topic"
          placeholder="Enter your blog topic. E.g., 10 Tips for Better Sleep, How to Start a Small Business, Benefits of Morning Exercise, Best Travel Destinations..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Tone" options={blogToneOptions} value={tone} onChange={(e) => setTone(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Blog Post
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function InstagramCaption() {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('engaging');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write an ${style} Instagram caption for: "${description}"

Requirements:
- Start with an attention-grabbing first line
- Write engaging body text that connects with the audience
- Include a call-to-action or question
- Add 5-10 relevant hashtags at the end
- Keep it concise but impactful
- Do NOT use asterisks or single quotes in the caption text
- Make it ${style} and shareable

Respond with only the caption including hashtags.`;

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
          label="Post Description"
          placeholder="Describe your post. E.g., Photo of sunset at the beach, New product launch, Fitness transformation, Travel photo from Paris, Food photography..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <Select label="Style" options={captionStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!description.trim()}>
          Generate Caption
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function WriterToolWrapper({ toolId }: WriterToolProps) {
  switch (toolId) {
    case 'content-writer':
      return <ContentWriter />;
    case 'kids-story':
      return <KidsStoryWriter />;
    case 'blog-post':
      return <BlogPostWriter />;
    case 'instagram-caption':
      return <InstagramCaption />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}
