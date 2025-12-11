import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { ProcessedImage, AppState, CreativeBrief } from './types';
import { MAX_IMAGES } from './constants';
import UploadZone from './components/UploadZone';
import BriefResult from './components/BriefResult';
import { generateCreativeBrief } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    
    setAppState('analyzing');
    setError(null);

    try {
      const result = await generateCreativeBrief(images);
      setBrief(result);
      setAppState('results');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze images. Please ensure your API key is valid and try again.');
      setAppState('upload');
    }
  };

  const handleReset = () => {
    setImages([]);
    setBrief(null);
    setAppState('upload');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">VisualBrief AI</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
             Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-fade-in">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {appState === 'upload' && (
          <div className="max-w-3xl mx-auto text-center space-y-8 py-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Generate a Creative Brief <br/> from your Visual Assets
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Upload up to {MAX_IMAGES} marketing images. Our AI will analyze your visual style, brand voice, and messaging to create a professional brief in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <UploadZone 
                images={images} 
                onImagesChange={setImages} 
                isProcessing={false}
              />
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={images.length === 0}
                  className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform ${
                    images.length > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Start Analysis
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-8">
              {[
                { title: 'Visual Analysis', desc: 'Extracts color palettes, typography, and layout patterns.' },
                { title: 'Brand Voice', desc: 'Identifies emotional tone and personality traits.' },
                { title: 'Strategic Output', desc: 'Get actionable recommendations for your next campaign.' }
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
              <Loader2 size={64} className="text-blue-600 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Analyzing your assets...</h3>
              <p className="text-slate-500">Deconstructing visual elements, extracting brand voice, and compiling strategy.</p>
              <div className="flex justify-center gap-2 pt-4">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}

        {appState === 'results' && brief && (
          <BriefResult brief={brief} sourceImages={images} onReset={handleReset} />
        )}

      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <p>© 2025 VisualBrief AI. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
