import { useState } from 'react';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { ResultBox } from '@/components/ui/ResultBox';
import { Music, Download, Loader } from 'lucide-react';

interface UtilityToolProps {
  toolId: string;
}

export function UtilityToolWrapper({ toolId }: UtilityToolProps) {
  switch (toolId) {
    case 'text-to-music':
      return <TextToMusic />;
    default:
      return <div className="text-slate-400">Tool not found</div>;
  }
}

function TextToMusic() {
  const [prompt, setPrompt] = useState('');
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) {
      setError('Please enter a music description');
      return;
    }

    setIsLoading(true);
    setError('');
    setMusicUrl('');

    try {
      const Bytez = (await import('bytez.js')).default;
      
      const key = '587f326079d22030bfcac35124690e14';
      const sdk = new Bytez(key);
      
      const model = sdk.model('facebook/musicgen-melody');
      
      const result = await model.run(prompt);

      console.log('Music Generation Response:', result);

      if (result.error) {
        setError(`Error: ${result.error}`);
      } else if (result.output) {
        let audioUrl = result.output;
        
        if (typeof result.output === 'object' && result.output !== null) {
          audioUrl = result.output.url || result.output.data || result.output;
        }
        
        audioUrl = String(audioUrl);
        
        if (audioUrl.startsWith('data:audio') || audioUrl.includes('base64')) {
          setMusicUrl(audioUrl);
        } else if (audioUrl.startsWith('http')) {
          setMusicUrl(audioUrl);
        } else {
          try {
            const blob = new Blob([audioUrl], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            setMusicUrl(url);
          } catch (e) {
            if (audioUrl.includes('base64')) {
              setMusicUrl(audioUrl);
            } else {
              setError('Invalid audio data format received');
            }
          }
        }
      } else {
        setError('Failed to generate music. Please try again.');
      }
    } catch (err) {
      console.error('Music Generation Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating music');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!musicUrl) return;

    try {
      const a = document.createElement('a');
      a.href = musicUrl;
      
      let filename = `music_${Date.now()}.mp3`;
      
      if (musicUrl.includes('data:audio/wav')) {
        filename = `music_${Date.now()}.wav`;
      } else if (musicUrl.includes('data:audio/ogg')) {
        filename = `music_${Date.now()}.ogg`;
      } else if (musicUrl.includes('data:audio/webm')) {
        filename = `music_${Date.now()}.webm`;
      }
      
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        if (musicUrl.startsWith('blob:')) {
          URL.revokeObjectURL(musicUrl);
        }
      }, 100);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download music. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-6 backdrop-blur-sm">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-white mb-2">
            <Music className="inline-block mr-2 w-4 h-4" />
            Describe Your Music
          </label>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the music you want to generate... (e.g., 'Moody jazz music with saxophones', 'Upbeat electronic dance music', 'Classical piano composition')"
            rows={6}
          />
          <div className="mt-2 text-xs text-slate-400">
            {prompt.length} characters
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleGenerateMusic}
            disabled={isLoading || !prompt.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating Music...
              </>
            ) : (
              <>
                <Music className="w-4 h-4 mr-2" />
                Generate Music
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {musicUrl && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Music Output</h3>

          <div className="mb-6">
            <audio
              controls
              controlsList="nodownload"
              className="w-full bg-slate-900/50 rounded-xl focus:outline-none"
              src={musicUrl}
              onError={(e) => {
                console.error('Audio playback error:', e);
                setError('Error playing music. The audio format may not be supported.');
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Music
          </Button>
        </div>
      )}

      <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-purple-400 mb-2">Music Generation Tips:</h4>
        <ul className="text-xs text-slate-300 space-y-1">
          <li>✓ Describe the genre, mood, and instruments</li>
          <li>✓ Be specific about tempo and style</li>
          <li>✓ Longer descriptions often yield better results</li>
          <li>✓ Try phrases like "upbeat", "melancholic", "energetic"</li>
        </ul>
      </div>
    </div>
  );
}
