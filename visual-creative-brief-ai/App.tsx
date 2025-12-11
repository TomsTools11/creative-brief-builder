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
    <div className="min-h-screen bg-white flex flex-col font-sans text-primary-text">

      {/* Navbar */}
      <header className="bg-primary-dark sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary-accent p-2 rounded-btn text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="font-bold text-h4 tracking-tight text-white">VisualBrief AI</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-10">

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-error/30 rounded-card flex items-center gap-3 text-error animate-fade-in">
            <AlertCircle size={20} />
            <p className="text-body">{error}</p>
          </div>
        )}

        {appState === 'upload' && (
          <div className="max-w-3xl mx-auto text-center space-y-10 py-12">
            <div className="space-y-4">
              <h2 className="text-h1 font-bold tracking-tight text-primary-dark">
                Generate a creative brief from your visual assets
              </h2>
              <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
                Upload up to {MAX_IMAGES} marketing images. Our AI will analyze your visual style, brand voice, and messaging to create a professional brief in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card shadow-card border border-border-light">
              <UploadZone
                images={images}
                onImagesChange={setImages}
                isProcessing={false}
              />

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={images.length === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-btn font-semibold text-body transition-all duration-200 transform focus-ring ${
                    images.length > 0
                      ? 'bg-primary-text text-white hover:bg-primary-dark shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.98]'
                      : 'bg-border-light text-text-secondary cursor-not-allowed'
                  }`}
                >
                  Start analysis
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6">
              {[
                { title: 'Visual analysis', desc: 'Extracts color palettes, typography, and layout patterns from your images.' },
                { title: 'Brand voice', desc: 'Identifies emotional tone and personality traits in your visual content.' },
                { title: 'Strategic output', desc: 'Get actionable recommendations for your next marketing campaign.' }
              ].map((f, i) => (
                <div key={i} className="p-5 rounded-card bg-white border border-border-light shadow-card hover:shadow-card-hover transition-all duration-200">
                  <h3 className="font-bold text-primary-dark mb-2 text-body-lg">{f.title}</h3>
                  <p className="text-body-sm text-text-secondary">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-accent blur-xl opacity-20 animate-pulse rounded-full"></div>
              <Loader2 size={56} className="text-primary-dark animate-spin relative z-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-h2 font-bold text-primary-dark">Analyzing your assets</h3>
              <p className="text-text-secondary text-body-lg max-w-md">Deconstructing visual elements, extracting brand voice, and compiling strategy.</p>
              <div className="flex justify-center gap-2 pt-4">
                  <span className="w-2 h-2 bg-primary-accent rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-primary-accent rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-primary-accent rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}

        {appState === 'results' && brief && (
          <BriefResult brief={brief} sourceImages={images} onReset={handleReset} />
        )}

      </main>

      <footer className="bg-primary-dark py-6 text-center text-body-sm text-text-secondary">
        <p>Made with ❤️ by <a href="https://tom-panos.com" target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:text-accent-light transition-colors">Tom in Milwaukee, WI</a>.</p>
      </footer>
    </div>
  );
};

export default App;
