import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Palette, Type, LayoutGrid, FileCheck, Zap, CheckCircle2, Circle, Loader2, Globe, RefreshCw } from 'lucide-react';
import docbuildrLogo from './docbuildr-logo.svg';
import { ProcessedImage, AppState, CreativeBrief } from './types';
import { MAX_IMAGES } from './constants';
import UploadZone from './components/UploadZone';
import BriefResult from './components/BriefResult';
import { generateCreativeBrief } from './services/geminiService';

// Analysis steps for progress UI
const ANALYSIS_STEPS = [
  { id: 'upload', label: 'Processing images', icon: Globe },
  { id: 'colors', label: 'Extracting visual style', icon: Palette },
  { id: 'typography', label: 'Analyzing brand voice', icon: Type },
  { id: 'components', label: 'Identifying messaging', icon: LayoutGrid },
  { id: 'pdf', label: 'Generating brief', icon: FileCheck },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (images.length === 0) return;

    setAppState('analyzing');
    setError(null);
    setCurrentStep(0);
    setProgress(0);

    // Simulate progress through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          setProgress((prev + 1) * (100 / ANALYSIS_STEPS.length));
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    try {
      const result = await generateCreativeBrief(images);
      clearInterval(stepInterval);
      setProgress(100);
      setCurrentStep(ANALYSIS_STEPS.length - 1);

      // Brief delay to show completion
      setTimeout(() => {
        setBrief(result);
        setAppState('results');
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
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
    setCurrentStep(0);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">

      {/* Header */}
      <header className="border-b border-border-dark sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <a href="https://docbuildr.app" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img src={docbuildrLogo} alt="DocBuildr" className="h-8" />
          </a>

          {appState === 'results' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <RefreshCw size={14} />
              New Analysis
            </button>
          )}

          {appState === 'analyzing' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowRight size={14} className="rotate-180" />
              Cancel
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">

        {/* Error Banner */}
        {error && (
          <div className="max-w-[1280px] mx-auto px-6 pt-6">
            <div className="p-4 bg-error/10 border border-error/30 rounded-card flex items-center gap-3 text-error animate-fade-in">
              <AlertCircle size={20} />
              <p className="text-body">{error}</p>
            </div>
          </div>
        )}

        {/* Upload State - Landing Page */}
        {appState === 'upload' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="pt-16 pb-12 px-6">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border-dark rounded-full text-body-sm text-text-secondary">
                  <Zap size={14} className="text-accent-blue" />
                  AI-Powered Creative Brief Generation
                </div>

                {/* Headline */}
                <h1 className="font-display text-display text-text-primary">
                  Generate Professional<br />
                  <span className="text-gradient">Creative Briefs</span> in Seconds
                </h1>

                {/* Subheadline */}
                <p className="text-body-lg text-text-secondary max-w-xl mx-auto">
                  Upload your marketing assets and receive a comprehensive creative brief documenting visual style, brand voice, messaging strategy, and more.
                </p>
              </div>
            </section>

            {/* Upload Section */}
            <section className="px-6 pb-8">
              <div className="max-w-2xl mx-auto">
                <div className="gradient-border p-6">
                  <UploadZone
                    images={images}
                    onImagesChange={setImages}
                    isProcessing={false}
                  />

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleAnalyze}
                      disabled={images.length === 0}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-btn font-medium text-body transition-all duration-200 ${
                        images.length > 0
                          ? 'bg-accent-blue text-white hover:bg-accent-blue-hover shadow-glow-blue'
                          : 'bg-border-dark text-text-muted cursor-not-allowed'
                      }`}
                    >
                      Generate Brief
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Preview Card */}
            <section className="px-6 pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden shadow-card">
                  {/* Preview Header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border-dark bg-bg-secondary/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <span className="text-caption text-text-muted">creative-brief-preview.pdf</span>
                  </div>

                  {/* Preview Content */}
                  <div className="p-6 grid grid-cols-3 gap-4">
                    {/* Cover Page Preview */}
                    <div className="bg-white rounded-btn p-4 shadow-sm">
                      <div className="text-[#1A1A1E] font-semibold text-body-sm mb-2">YourBrand.com</div>
                      <div className="text-text-muted text-caption mb-3">Brand & Design Style Guide</div>
                      <div className="flex gap-1.5 mb-3">
                        <div className="w-6 h-6 rounded-btn-sm bg-[#1A1A1E]"></div>
                        <div className="w-6 h-6 rounded-btn-sm bg-[#014379]"></div>
                        <div className="w-6 h-6 rounded-btn-sm bg-[#2383E2]"></div>
                        <div className="w-6 h-6 rounded-btn-sm bg-[#448361]"></div>
                        <div className="w-6 h-6 rounded-btn-sm bg-[#E5E7EB]"></div>
                      </div>
                    </div>

                    {/* Color Palette Preview */}
                    <div className="bg-white rounded-btn p-4 shadow-sm">
                      <div className="text-accent-blue text-caption font-medium mb-2">Visual Identity</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-[#1A1A1E]"></div>
                          <span className="text-[#444] text-caption">Primary</span>
                          <span className="text-text-muted text-caption ml-auto font-mono">#1A1A1E</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-[#014379]"></div>
                          <span className="text-[#444] text-caption">Secondary</span>
                          <span className="text-text-muted text-caption ml-auto font-mono">#014379</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-[#2383E2]"></div>
                          <span className="text-[#444] text-caption">Accent</span>
                          <span className="text-text-muted text-caption ml-auto font-mono">#2383E2</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-[#448361]"></div>
                          <span className="text-[#444] text-caption">Teal</span>
                          <span className="text-text-muted text-caption ml-auto font-mono">#448361</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-[#F9FAFB] border border-gray-200"></div>
                          <span className="text-[#444] text-caption">Background</span>
                          <span className="text-text-muted text-caption ml-auto font-mono">#F9FAFB</span>
                        </div>
                      </div>
                    </div>

                    {/* Typography Preview */}
                    <div className="bg-white rounded-btn p-4 shadow-sm">
                      <div className="text-accent-blue text-caption font-medium mb-2">Brand Voice</div>
                      <div className="space-y-1">
                        <div className="text-[#1A1A1E] font-semibold text-body">Heading 1</div>
                        <div className="text-[#1A1A1E] font-medium text-body-sm">Heading 2</div>
                        <div className="text-[#1A1A1E] text-body-sm">Heading 3</div>
                        <div className="text-[#444] text-caption leading-relaxed mt-2">
                          Body text looks like this, with good readability.
                        </div>
                        <div className="text-text-muted text-caption italic">
                          Caption text for smaller details.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page indicator */}
                  <div className="flex items-center justify-center gap-2 py-3 border-t border-border-dark">
                    <span className="text-caption text-text-muted">1 of 10 pages total</span>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-6 border-t border-border-dark">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-h2 text-text-primary mb-3">How It Works</h2>
                  <p className="text-body text-text-secondary">Three simple steps to create a comprehensive creative brief</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { num: '01', title: 'Upload Assets', desc: 'Upload your marketing images - logos, ads, social media graphics.' },
                    { num: '02', title: 'AI Analysis', desc: 'Our engine extracts visual patterns, brand voice, and messaging themes.' },
                    { num: '03', title: 'Download Brief', desc: 'Get a professional creative brief document ready to share.' },
                  ].map((step, i) => (
                    <div key={i} className="relative text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-btn border border-border-light text-accent-blue font-display font-bold text-body-lg mb-4">
                        {step.num}
                      </div>
                      {i < 2 && (
                        <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-border-light to-transparent"></div>
                      )}
                      <h3 className="font-display font-semibold text-body-lg text-text-primary mb-2">{step.title}</h3>
                      <p className="text-body-sm text-text-secondary">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-6 bg-bg-secondary">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-display text-h2 text-text-primary mb-3">Everything You Need</h2>
                  <p className="text-body text-text-secondary max-w-xl mx-auto">Our AI analyzes every aspect of your marketing assets and documents it professionally</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: Palette, title: 'Color Extraction', desc: 'Automatically extracts and organizes your color palette with hex, RGB values, and semantic roles.' },
                    { icon: Type, title: 'Typography Analysis', desc: 'Identifies font families, sizes, weights, and builds a comprehensive type scale.' },
                    { icon: LayoutGrid, title: 'Visual Motifs', desc: 'Detects patterns, icons, and visual elements used across your assets.' },
                    { icon: Zap, title: 'Brand Voice', desc: 'Analyzes tone, personality traits, and emotional appeal of your brand.' },
                    { icon: FileCheck, title: 'Professional PDF', desc: 'Generates a beautifully formatted, 10-page creative brief ready for your team.' },
                    { icon: CheckCircle2, title: 'Instant Results', desc: 'Complete analysis and PDF generation in under 60 seconds.' },
                  ].map((feature, i) => (
                    <div key={i} className="bg-bg-card border border-border-dark rounded-card p-5 card-hover">
                      <div className="inline-flex items-center justify-center w-9 h-9 rounded-btn bg-accent-blue/10 text-accent-blue mb-3">
                        <feature.icon size={18} />
                      </div>
                      <h3 className="font-semibold text-body text-text-primary mb-1.5">{feature.title}</h3>
                      <p className="text-body-sm text-text-secondary">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-display text-h2 text-text-primary mb-4">Ready to Create Your Creative Brief?</h2>
                <p className="text-body text-text-secondary mb-8">Join designers and marketers who use our tool to document their brand quickly and professionally.</p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-blue text-white rounded-btn font-medium text-body hover:bg-accent-blue-hover transition-colors shadow-glow-blue"
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Analyzing State */}
        {appState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 animate-fade-in">
            {/* Source indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border-dark rounded-full mb-8">
              <Globe size={16} className="text-accent-blue" />
              <span className="text-body-sm text-text-secondary">{images.length} {images.length === 1 ? 'asset' : 'assets'} uploaded</span>
            </div>

            {/* Title */}
            <h2 className="font-display text-h1 text-text-primary mb-2">Analyzing Your Assets</h2>
            <p className="text-body text-text-secondary mb-10">Please wait while we extract your brand insights...</p>

            {/* Progress Card */}
            <div className="w-full max-w-lg gradient-border p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-body-sm text-text-secondary">Overall Progress</span>
                  <span className="text-body-sm text-text-primary font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <div className="progress-bar h-full rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {ANALYSIS_STEPS.map((step, i) => {
                  const isComplete = i < currentStep;
                  const isCurrent = i === currentStep;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-btn transition-all duration-300 ${
                        isCurrent ? 'bg-accent-blue/10 border border-accent-blue/30' :
                        isComplete ? 'bg-bg-hover' : 'opacity-50'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isComplete ? 'bg-success text-white' :
                        isCurrent ? 'bg-accent-blue text-white' : 'bg-bg-hover text-text-muted'
                      }`}>
                        {isComplete ? (
                          <CheckCircle2 size={16} />
                        ) : isCurrent ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Circle size={16} />
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <StepIcon size={16} className={isComplete || isCurrent ? 'text-accent-blue' : 'text-text-muted'} />
                        <span className={`text-body-sm ${isComplete || isCurrent ? 'text-text-primary' : 'text-text-muted'}`}>
                          {step.label}
                        </span>
                      </div>
                      <span className={`text-caption ${
                        isComplete ? 'text-success' : isCurrent ? 'text-accent-blue' : 'text-text-muted'
                      }`}>
                        {isComplete ? 'Done' : isCurrent ? 'Processing...' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Tip */}
              <div className="mt-6 p-3 bg-bg-hover rounded-btn">
                <p className="text-caption text-text-secondary">
                  <span className="text-accent-blue font-medium">Tip:</span> Your creative brief will include visual identity, brand voice analysis, target audience insights, and strategic recommendations.
                </p>
              </div>
            </div>

            {/* Estimated time */}
            <p className="text-caption text-text-muted mt-8">
              Estimated time remaining: {Math.max(1, Math.ceil((100 - progress) / 20))} seconds
            </p>
          </div>
        )}

        {/* Results State */}
        {appState === 'results' && brief && (
          <div className="max-w-[1280px] mx-auto px-6 py-10">
            <BriefResult brief={brief} sourceImages={images} onReset={handleReset} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <a href="https://docbuildr.app" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <img src={docbuildrLogo} alt="DocBuildr" className="h-6" />
          </a>
          <p className="text-body-sm text-text-muted">
            Made with <span className="text-error">❤</span> by <a href="https://tom-panos.com" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Tom in Milwaukee, WI</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
