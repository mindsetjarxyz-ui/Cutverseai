import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToolCard } from '@/components/layout/ToolCard';
import { tools, Tool } from '@/data/tools';
import { StudentToolWrapper } from '@/components/tools/StudentTools';
import { WriterToolWrapper } from '@/components/tools/WriterTools';
import { ImageToolWrapper } from '@/components/tools/ImageTools';
import { SocialToolWrapper } from '@/components/tools/SocialTools';
import { Zap, Shield, Sparkles } from 'lucide-react';

export function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredTools = useMemo(() => {
    let filtered = tools;
    
    // Only filter by category - NO search filtering in the grid
    // Search results are shown ONLY in the dropdown
    if (activeCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === activeCategory);
    }
    
    return filtered;
  }, [activeCategory]);

  const categoryTitles: Record<string, string> = {
    all: 'All AI Tools',
    student: 'Student AI Tools',
    writer: 'AI Writing Tools',
    image: 'AI Image Tools',
    social: 'Social Media Tools'
  };

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    setSearchQuery(''); // Clear search when selecting a tool
  };

  const handleBack = () => {
    setActiveTool(null);
  };

  const renderToolComponent = () => {
    if (!activeTool) return null;

    switch (activeTool.category) {
      case 'student':
        return <StudentToolWrapper toolId={activeTool.id} />;
      case 'writer':
        return <WriterToolWrapper toolId={activeTool.id} />;
      case 'image':
        return <ImageToolWrapper toolId={activeTool.id} />;
      case 'social':
        return <SocialToolWrapper toolId={activeTool.id} />;
      default:
        return <div className="text-slate-400">Tool not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar 
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setActiveTool(null);
          setSearchQuery('');
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        hideToggle={!!activeTool}
      />
      
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <Header 
          title={activeTool ? activeTool.title : categoryTitles[activeCategory]}
          showBack={!!activeTool}
          onBack={handleBack}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToolSelect={handleToolClick}
        />
        
        <div className="flex-1 p-3 sm:p-4 md:p-6">
          {activeTool ? (
            <div className="max-w-6xl mx-auto animate-fadeIn">
              <div className="mb-4 sm:mb-6">
                <p className="text-slate-400 text-xs sm:text-sm">{activeTool.description}</p>
              </div>
              {renderToolComponent()}
            </div>
          ) : (
            <>
              {/* Hero Section - Only show on All Tools */}
              {activeCategory === 'all' && !searchQuery && (
                <div className="mb-8 sm:mb-10 py-10 sm:py-14 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-slate-900 via-blue-950/50 to-slate-900 border border-blue-500/10 rounded-2xl sm:rounded-3xl relative overflow-hidden">
                  {/* Background glow effects */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 text-center">
                    {/* Big Gradient Cutverse AI Title */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                      Cutverse AI
                    </h1>
                    
                    <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
                      Professional AI tools for everyone
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Lightning Fast</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Privacy First</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">Top Quality AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    {...tool}
                    onClick={() => handleToolClick(tool)}
                  />
                ))}
              </div>
              
              {filteredTools.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-slate-400 text-sm sm:text-base">No tools available in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-4 sm:py-6 px-3 sm:px-4 border-t border-slate-800">
          <p className="text-center text-slate-500 text-xs sm:text-sm">
            © Cutverse™ - All Rights Reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
