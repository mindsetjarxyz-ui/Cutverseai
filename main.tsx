import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { Volume2, Download, Play, Loader } from 'lucide-react';

interface UtilityToolProps {
  toolId: string;
}

export function UtilityToolWrapper({ toolId }: UtilityToolProps) {
  switch (toolId) {
    case 'text-to-speech':
      return <TextToSpeech />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}

function TextToSpeech() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioUrl('');

    try {
      // Dynamically import bytez.js
      const Bytez = (await import('bytez.js')).default;
      
      const key = '587f326079d22030bfcac35124690e14';
      const sdk = new Bytez(key);
      
      // Use tts-1-hd model for high-quality speech
      const model = sdk.model('openai/tts-1-hd');
      
      // Generate speech from text
      const result = await model.run(text);

      console.log('TTS Response:', result);

      if (result.error) {
        setError(`Error: ${result.error}`);
      } else if (result.output) {
        // result.output could be a URL string or object
        let audioUrl = result.output;
        
        // If output is an object, check for url or data properties
        if (typeof result.output === 'object' && result.output !== null) {
          audioUrl = result.output.url || result.output.data || result.output;
        }
        
        // Convert to string if needed
        audioUrl = String(audioUrl);
        
        // Check if it's a base64 audio data
        if (audioUrl.startsWith('data:audio') || audioUrl.startsWith('/9j') || audioUrl.includes('base64')) {
          // It's already proper format or base64
          setAudioUrl(audioUrl);
        } else if (audioUrl.startsWith('http')) {
          // It's a URL
          setAudioUrl(audioUrl);
        } else {
          // Might be binary data, convert to blob URL
          try {
            const blob = new Blob([audioUrl], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          } catch (e) {
            // Try as base64
            if (audioUrl.includes('base64')) {
              setAudioUrl(audioUrl);
            } else {
              setError('Invalid audio data format received');
            }
          }
        }
      } else {
        setError('Failed to generate speech. Please try again.');
      }
    } catch (err) {
      console.error('TTS Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating speech');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    try {
      const a = document.createElement('a');
      a.href = audioUrl;
      
      // Determine file extension based on audio source
      let filename = `speech_${Date.now()}.mp3`;
      
      if (audioUrl.includes('data:audio/wav')) {
        filename = `speech_${Date.now()}.wav`;
      } else if (audioUrl.includes('data:audio/ogg')) {
        filename = `speech_${Date.now()}.ogg`;
      } else if (audioUrl.includes('data:audio/webm')) {
        filename = `speech_${Date.now()}.webm`;
      }
      
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        // For blob URLs, revoke them to free memory
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
      }, 100);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download audio. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-6 backdrop-blur-sm">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-white mb-2">
            <Volume2 className="inline-block mr-2 w-4 h-4" />
            Enter Text to Convert
          </label>
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech... (e.g., Hello, this is a test message!)"
            rows={6}
          />
          <div className="mt-2 text-xs text-slate-400">
            {text.length} characters
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGenerateSpeech}
            disabled={isLoading || !text.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Generate Speech
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Result Section */}
      {audioUrl && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Audio Output</h3>

          {/* Audio Player */}
          <div className="mb-6">
            <audio
              controls
              controlsList="nodownload"
              className="w-full bg-slate-900/50 rounded-xl focus:outline-none"
              src={audioUrl}
              onError={(e) => {
                console.error('Audio playback error:', e);
                setError('Error playing audio. The audio format may not be supported.');
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Audio File
          </Button>

          {/* Info */}
          <p className="text-xs text-slate-400 mt-4 text-center">
            Audio generated with OpenAI TTS-1-HD voice model
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">Features:</h4>
        <ul className="text-xs text-slate-300 space-y-1">
          <li>✓ High-quality HD voice synthesis</li>
          <li>✓ Natural and expressive speech</li>
          <li>✓ Download audio files in MP3 format</li>
          <li>✓ Listen instantly in your browser</li>
          <li>✓ Powered by OpenAI TTS-1-HD</li>
        </ul>
      </div>
    </div>
  );
}
