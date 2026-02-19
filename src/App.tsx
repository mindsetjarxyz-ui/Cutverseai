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
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [activeCategory, searchQuery]);

  const categoryTitles: Record<string, string> = {
    all: 'All AI Tools',
    student: 'Student AI Tools',
    writer: 'AI Writing Tools',
    image: 'AI Image Tools',
    social: 'Social Media Tools'
  };

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
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
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="lg:ml-64 min-h-screen">
        <Header 
          title={activeTool ? activeTool.title : categoryTitles[activeCategory]}
          showBack={!!activeTool}
          onBack={handleBack}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="p-4 sm:p-6">
          {activeTool ? (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <p className="text-slate-400 text-sm">{activeTool.description}</p>
              </div>
              {renderToolComponent()}
            </div>
          ) : (
            <>
              {/* Hero Section - Only show on All Tools */}
              {activeCategory === 'all' && !searchQuery && (
                <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl">
                  <div className="max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      Create with Cutverse AI
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Professional AI tools for everyone. Generate content, images, and more with the power of artificial intelligence.
                    </p>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm">Lightning Fast</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm">Privacy First</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-sm">Top Quality AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    {...tool}
                    onClick={() => handleToolClick(tool)}
                  />
                ))}
              </div>
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">No tools found matching your search.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-6 px-4 border-t border-slate-800">
          <p className="text-center text-slate-500 text-sm">
            © Cutverse™ - All Rights Reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
