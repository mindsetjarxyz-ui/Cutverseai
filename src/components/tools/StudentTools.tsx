import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { generateText } from '@/services/ai';
import { classOptions } from '@/data/tools';

interface StudentToolProps {
  toolId: string;
}

const wordCountOptions = [
  { value: '100', label: '100 words' },
  { value: '200', label: '200 words' },
  { value: '300', label: '300 words' },
  { value: '400', label: '400 words' },
  { value: '500', label: '500 words' },
];

const essayWordCountOptions = [
  { value: '300', label: '300 words' },
  { value: '500', label: '500 words' },
  { value: '600', label: '600 words' },
  { value: '800', label: '800 words' },
];

const stanceOptions = [
  { value: 'for', label: 'For the motion' },
  { value: 'against', label: 'Against the motion' },
  { value: 'balanced', label: 'Balanced view' },
];

const durationOptions = [
  { value: 'short', label: 'Short (2-3 min)' },
  { value: 'medium', label: 'Medium (5-7 min)' },
  { value: 'long', label: 'Long (10+ min)' },
];

const summaryStyleOptions = [
  { value: 'very-short', label: 'Very Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'detailed', label: 'Detailed but Simple' },
];

const compositionStyleOptions = [
  { value: 'narrative', label: 'Narrative' },
  { value: 'descriptive', label: 'Descriptive' },
  { value: 'reflective', label: 'Reflective' },
];

export function ApplicationWriter() {
  const [details, setDetails] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write a formal application letter based on these details. Use academic and professional tone throughout.

Details: ${details}

Requirements:
- Write a complete, well-structured application with proper formatting
- Include date, recipient details, subject line, salutation, body paragraphs, and closing
- Use formal and professional language
- Do NOT use hash symbols, asterisks, or single quotes in your response
- Make the title/subject clear and prominent
- Include a proper sign-off

Respond with only the application letter, nothing else.`;

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
          label="Application Details"
          placeholder="Explain who you are, why you are writing this application, and any important details. You can also type instructions like 'write in Bangla' or specify the recipient, reason, dates, etc."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={10}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!details.trim()}>
          Generate Application
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function LetterWriter() {
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState('formal');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toneOptions = [
    { value: 'formal', label: 'Respectful Formal' },
    { value: 'friendly', label: 'Friendly' },
  ];

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Write a ${tone} letter based on these details:

${details}

Requirements:
- Write a complete letter with proper greeting, body paragraphs, and closing
- Use ${tone} tone and language throughout
- Do NOT use hash symbols, asterisks, or single quotes
- Make it well-structured and professional
- Include appropriate salutation and sign-off

Respond with only the letter, nothing else.`;

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
          label="Letter Details"
          placeholder="Explain who you are writing to, the relationship, and purpose. You can request a specific language like 'write in Bangla'. Specify if it's a formal or informal letter."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={8}
        />
        <Select label="Tone" options={toneOptions} value={tone} onChange={(e) => setTone(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!details.trim()}>
          Generate Letter
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function DebateWriter() {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [stance, setStance] = useState('for');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const stanceText = stance === 'for' ? 'in favor of' : stance === 'against' ? 'against' : 'presenting both sides of';
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a debate speech ${stanceText} the motion: "${topic}"

This is for a ${levelText} student. Adjust vocabulary and complexity accordingly.

Requirements:
- Include a strong opening statement
- Present main arguments with supporting points
- Address counter-arguments with rebuttals
- End with a powerful conclusion
- Use vocabulary appropriate for ${levelText} level
- Do NOT use hash symbols, asterisks, or single quotes
- Make key arguments prominent

Respond with only the debate speech, nothing else.`;

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
          label="Debate Topic"
          placeholder="Enter the debate topic, for example: Should homework be banned? You can add language instructions like 'write in Hindi'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Select label="Stance" options={stanceOptions} value={stance} onChange={(e) => setStance(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Debate
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function SpeechWriter() {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [duration, setDuration] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a ${duration} speech on: "${topic}"

This is for a ${levelText} student. Adjust vocabulary and complexity accordingly.

Requirements:
- Include an appropriate greeting for the occasion
- Write an engaging introduction
- Develop main content with clear points
- End with a memorable conclusion
- Use vocabulary suitable for ${levelText}
- Do NOT use hash symbols, asterisks, or single quotes
- Make the speech engaging and appropriate for delivery

Respond with only the speech, nothing else.`;

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
          label="Speech Topic and Details"
          placeholder="Enter the topic and any specific instructions. You can specify speech type (welcome, farewell, motivational) and language like 'write in Bangla'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Select label="Duration" options={durationOptions} value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Speech
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function SummaryGenerator() {
  const [text, setText] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [style, setStyle] = useState('medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Summarize this text in a ${style} way for a ${levelText} student:

"${text}"

Requirements:
- Use vocabulary appropriate for ${levelText}
- For lower classes, use very simple words and short sentences
- For university level, keep key technical terms but explain clearly
- Make the summary clear and easy to understand
- Do NOT use hash symbols, asterisks, or single quotes
- Highlight the main ideas

Respond with only the summary, nothing else.`;

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
          label="Text to Summarize"
          placeholder="Paste the long text, article, or chapter you want to summarize..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Select label="Summary Style" options={summaryStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!text.trim()}>
          Generate Summary
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function GrammarCorrector() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    
    const prompt = `Correct the grammar, spelling, and sentence structure of this text. Rewrite sentences to be clearer, more natural, and grammatically correct while keeping the original meaning:

"${text}"

Requirements:
- Fix all grammar and spelling errors
- Improve sentence structure for clarity
- Rewrite awkward sentences naturally
- Keep the original meaning and tone
- Do NOT use hash symbols, asterisks, or single quotes
- Start with "Corrected Text" as the heading

Respond with only the corrected text with the heading.`;

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
          label="Text to Correct"
          placeholder="Paste any text that needs grammar and spelling correction. The AI will fix errors and improve sentence structure..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        <Button onClick={handleGenerate} loading={loading} disabled={!text.trim()}>
          Correct Text
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function ParagraphWriter() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('200');
  const [classLevel, setClassLevel] = useState('class-10');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a well-structured paragraph of approximately ${wordCount} words on: "${topic}"

This is for a ${levelText} student. Adjust vocabulary and complexity accordingly.

Requirements:
- Start with a bold title for the paragraph
- Include a clear topic sentence
- Add supporting details and examples
- End with a concluding sentence
- Use vocabulary appropriate for ${levelText}
- Do NOT use hash symbols, asterisks, or single quotes
- Make key words and phrases prominent

Respond with the title and paragraph only.`;

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
          label="Topic and Details"
          placeholder="Enter the topic and any details. Example: My Best Friend, simple language, write in Bangla."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Word Count</label>
          <div className="flex flex-wrap gap-2">
            {wordCountOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setWordCount(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  wordCount === opt.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Paragraph
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function EssayWriter() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('500');
  const [classLevel, setClassLevel] = useState('class-10');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a comprehensive essay of approximately ${wordCount} words on: "${topic}"

This is for a ${levelText} student. Adjust vocabulary and complexity accordingly.

Requirements:
- Start with a clear, bold title
- Include an Introduction paragraph with a heading
- Write 2-3 Body paragraphs, each with its own heading/name
- End with a Conclusion paragraph with heading
- Use vocabulary appropriate for ${levelText}
- Do NOT use hash symbols, asterisks, or single quotes
- Make headings and key concepts prominent
- Include good transitions between paragraphs

Respond with the complete essay with all headings.`;

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
          label="Topic and Instructions"
          placeholder="Enter the essay topic and any specific instructions. You can specify language preferences like 'write in Hindi'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Word Count</label>
          <div className="flex flex-wrap gap-2">
            {essayWordCountOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setWordCount(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  wordCount === opt.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Essay
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function CompositionWriter() {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [style, setStyle] = useState('narrative');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write a ${style} composition on: "${topic}"

This is for a ${levelText} student. Adjust vocabulary and complexity accordingly.

Requirements:
- Start with a bold title
- Write as flowing prose WITHOUT paragraph names or section headings
- For narrative style, use storytelling elements with characters and events
- For descriptive style, use vivid imagery and sensory details
- For reflective style, include personal thoughts and insights
- Use vocabulary appropriate for ${levelText}
- Do NOT use hash symbols, asterisks, or single quotes
- Make the composition engaging and well-structured

Respond with only the title and composition as flowing paragraphs.`;

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
          label="Composition Topic"
          placeholder="Enter the topic. Examples: A rainy day, My school, A visit to the zoo, My favorite festival..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={4}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Select label="Style" options={compositionStyleOptions} value={style} onChange={(e) => setStyle(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Composition
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function StoryGenerator() {
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('class-10');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    
    const levelText = classLevel.replace('-', ' ').replace('class', 'Class');
    
    const prompt = `Write an engaging story based on: "${topic}"

This is for a ${levelText} student. Adjust vocabulary, complexity, and themes accordingly.

Requirements:
- Start with an attention-grabbing title
- Write an engaging introduction that sets the scene
- Develop well-rounded characters
- Include rising action, climax, and resolution
- End with a satisfying conclusion, optionally with a moral or lesson
- Use vocabulary appropriate for ${levelText}
- Do NOT use hash symbols, asterisks, or single quotes
- Make key moments and dialogue prominent

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
          label="Story Topic and Details"
          placeholder="Enter the story topic, characters, setting, or any specific details. You can specify language preferences like 'write in Bangla'."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={6}
        />
        <Select label="Class Level" options={classOptions} value={classLevel} onChange={(e) => setClassLevel(e.target.value)} />
        <Button onClick={handleGenerate} loading={loading} disabled={!topic.trim()}>
          Generate Story
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
      <ResultBox content={result} isLoading={loading} />
    </div>
  );
}

export function StudentToolWrapper({ toolId }: StudentToolProps) {
  switch (toolId) {
    case 'application-writer':
      return <ApplicationWriter />;
    case 'letter-writer':
      return <LetterWriter />;
    case 'debate-writer':
      return <DebateWriter />;
    case 'speech-writer':
      return <SpeechWriter />;
    case 'summary-generator':
      return <SummaryGenerator />;
    case 'grammar-corrector':
      return <GrammarCorrector />;
    case 'paragraph-writer':
      return <ParagraphWriter />;
    case 'essay-writer':
      return <EssayWriter />;
    case 'composition-writer':
      return <CompositionWriter />;
    case 'story-generator':
      return <StoryGenerator />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}
