import { 
  LayoutGrid, 
  GraduationCap, 
  PenTool, 
  Image, 
  Youtube,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categories = [
  { id: 'all', label: 'All Tools', icon: LayoutGrid },
  { id: 'student', label: 'Student AI', icon: GraduationCap },
  { id: 'writer', label: 'AI Writing', icon: PenTool },
  { id: 'image', label: 'AI Image', icon: Image },
  { id: 'social', label: 'Social Media', icon: Youtube },
];

export function Sidebar({ activeCategory, onCategoryChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-slate-800 rounded-lg text-white"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Cutverse AI</h1>
              <p className="text-slate-500 text-xs">AI Tools Platform</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange(cat.id);
                if (window.innerWidth < 1024) onToggle();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                activeCategory === cat.id 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border border-blue-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              )}
            >
              <cat.icon className="w-5 h-5" />
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <p className="text-slate-500 text-xs text-center">© Cutverse™</p>
        </div>
      </aside>
    </>
  );
}
