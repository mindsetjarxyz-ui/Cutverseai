import { useState, useEffect, useRef } from 'react';
import { Copy, Pencil, Save, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatOutputText } from '@/services/ai';

interface ResultBoxProps {
  content: string;
  isLoading?: boolean;
  showTypewriter?: boolean;
  onContentChange?: (content: string) => void;
  className?: string;
}

export function ResultBox({ 
  content, 
  isLoading = false, 
  showTypewriter = true,
  onContentChange,
  className 
}: ResultBoxProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevContentRef = useRef('');
  const isEditedRef = useRef(false);

  useEffect(() => {
    // Skip typewriter if content was edited or if skipTypewriter is true
    if (skipTypewriter || isEditedRef.current) {
      setDisplayedContent(content);
      return;
    }
    
    // Only animate if content is new and different from previous
    if (content && content !== prevContentRef.current && showTypewriter) {
      setDisplayedContent('');
      let index = 0;
      const speed = 2; // Very fast typewriter speed
      
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, speed);
      
      prevContentRef.current = content;
      return () => clearInterval(timer);
    } else if (content) {
      setDisplayedContent(content);
      prevContentRef.current = content;
    }
  }, [content, showTypewriter, skipTypewriter]);

  // Reset when content changes from external source (new generation)
  useEffect(() => {
    if (content !== prevContentRef.current && !isEditedRef.current) {
      setSkipTypewriter(false);
    }
  }, [content]);

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedContent : (isEditedRef.current ? editedContent : content);
    const plainText = textToCopy.replace(/<[^>]*>/g, '');
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditedContent(displayedContent);
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    setDisplayedContent(editedContent);
    setSkipTypewriter(true); // Skip typewriter for edited content
    isEditedRef.current = true; // Mark as edited
    prevContentRef.current = editedContent;
    if (onContentChange) {
      onContentChange(editedContent);
    }
  };

  const formattedContent = formatOutputText(displayedContent);

  return (
    <div className={cn('bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-slate-800/50">
        <span className="text-xs text-slate-400 font-medium">Result</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            title="Copy"
            disabled={!content && !displayedContent}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
              title="Save"
            >
              <Save className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
              title="Edit"
              disabled={!content && !displayedContent}
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 min-h-[200px] max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          </div>
        ) : isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[200px] bg-transparent text-slate-200 resize-none focus:outline-none leading-relaxed"
          />
        ) : displayedContent ? (
          <div 
            className="text-slate-200 leading-relaxed whitespace-pre-wrap prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        ) : (
          <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
            Your generated content will appear here
          </div>
        )}
      </div>
    </div>
  );
}
