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
    <div className="min-h-screen bg-white flex flex-col font-serif text-near-black">

      {/* Navbar */}
      <header className="bg-near-black sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent-teal p-1.5 rounded-btn text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">VisualBrief AI</h1>
          </div>
          <div className="text-body-lg text-text-secondary">
             Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-10">

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-error-red/30 rounded-card flex items-center gap-3 text-error-red animate-fade-in">
            <AlertCircle size={20} />
            <p className="text-body-lg">{error}</p>
          </div>
        )}

        {appState === 'upload' && (
          <div className="max-w-3xl mx-auto text-center space-y-10 py-16">
            <div className="space-y-5">
              <h2 className="text-h1 font-bold tracking-tight text-near-black">
                Generate a creative brief <br/> from your visual assets
              </h2>
              <p className="text-h4 text-text-secondary max-w-xl mx-auto">
                Upload up to {MAX_IMAGES} marketing images. Our AI will analyze your visual style, brand voice, and messaging to create a professional brief in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card shadow-card border border-gray-200">
              <UploadZone
                images={images}
                onImagesChange={setImages}
                isProcessing={false}
              />

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={images.length === 0}
                  className={`flex items-center gap-2 px-8 py-4 rounded-btn-lg font-semibold text-lg transition-all duration-200 transform focus-ring ${
                    images.length > 0
                      ? 'bg-near-black text-white hover:bg-near-black/90 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Start analysis
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-8">
              {[
                { title: 'Visual analysis', desc: 'Extracts color palettes, typography, and layout patterns.' },
                { title: 'Brand voice', desc: 'Identifies emotional tone and personality traits.' },
                { title: 'Strategic output', desc: 'Get actionable recommendations for your next campaign.' }
              ].map((f, i) => (
                <div key={i} className="p-5 rounded-card bg-white border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-200">
                  <h3 className="font-bold text-near-black mb-2 text-h3">{f.title}</h3>
                  <p className="text-body-lg text-text-secondary">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-teal blur-xl opacity-20 animate-pulse rounded-full"></div>
              <Loader2 size={64} className="text-near-black animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-h2 font-bold text-near-black">Analyzing your assets...</h3>
              <p className="text-text-secondary text-h4">Deconstructing visual elements, extracting brand voice, and compiling strategy.</p>
              <div className="flex justify-center gap-2 pt-4">
                  <span className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}

        {appState === 'results' && brief && (
          <BriefResult brief={brief} sourceImages={images} onReset={handleReset} />
        )}

      </main>

      <footer className="bg-near-black py-8 text-center text-body-lg text-text-secondary">
        <p>&copy; 2025 VisualBrief AI. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
