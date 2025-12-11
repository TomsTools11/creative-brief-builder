import React from 'react';
import { Download, RotateCcw, Palette, MessageSquare, Users, Lightbulb, Check, X as XIcon, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { CreativeBrief, ProcessedImage } from '../types';
import jsPDF from 'jspdf';

interface BriefResultProps {
  brief: CreativeBrief;
  sourceImages: ProcessedImage[];
  onReset: () => void;
}

const BriefResult: React.FC<BriefResultProps> = ({ brief, sourceImages, onReset }) => {
  const { visualStyle, brandVoice, messaging, targetAudience, recommendations } = brief;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    const addTitle = (text: string) => {
      if (yPos > 260) { doc.addPage(); yPos = 20; }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(32, 32, 32);
      doc.text(text, margin, yPos);
      yPos += lineHeight * 1.5;
    };

    const addSubTitle = (text: string) => {
      if (yPos > 265) { doc.addPage(); yPos = 20; }
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(68, 75, 78);
      doc.text(text, margin, yPos);
      yPos += lineHeight;
    };

    const addText = (text: string, indent = 0) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(68, 75, 78);
      const splitText = doc.splitTextToSize(text, contentWidth - indent);
      doc.text(splitText, margin + indent, yPos);
      yPos += (splitText.length * lineHeight) + 2;
    };

    const addBullet = (text: string) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(68, 75, 78);
      const splitText = doc.splitTextToSize(text, contentWidth - 10);
      doc.text("•", margin + 4, yPos);
      doc.text(splitText, margin + 10, yPos);
      yPos += (splitText.length * lineHeight) + 1;
    };

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(32, 32, 32);
    doc.text("Creative Brief", margin, yPos);
    yPos += lineHeight * 1.5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(167, 163, 154);
    doc.text(`Generated on ${new Date(brief.meta.analyzedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, yPos);
    doc.text(`Based on ${brief.meta.imageCount} analyzed assets`, margin + 80, yPos);
    yPos += lineHeight * 2;

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
    yPos += 5;

    // Visual Identity
    addTitle("Visual Identity");
    addSubTitle("Color Palette");
    addText(`Primary: ${visualStyle.colorPalette.primary}`);
    if (visualStyle.colorPalette.secondary.length > 0) {
      addText(`Secondary: ${visualStyle.colorPalette.secondary.join(', ')}`);
    }
    addText(`Accent: ${visualStyle.colorPalette.accent}`);
    yPos += 3;

    addSubTitle("Typography");
    addText(`Style: ${visualStyle.typography.style}`);
    addText(`Hierarchy: ${visualStyle.typography.hierarchy}`);
    yPos += 3;

    if (visualStyle.visualMotifs.length > 0) {
      addSubTitle("Visual Motifs");
      addText(visualStyle.visualMotifs.join(', '));
    }
    yPos += 5;

    // Brand Voice
    addTitle("Brand Voice & Tone");
    addSubTitle("Tone Profile");
    addText(brandVoice.tone);
    yPos += 3;
    addSubTitle("Emotional Appeal");
    addText(brandVoice.emotionalAppeal);
    yPos += 3;
    addSubTitle("Personality Traits");
    brandVoice.personality.forEach(p => addBullet(p));
    yPos += 5;

    // Target Audience
    addTitle("Target Audience");
    addSubTitle("Demographics");
    addText(targetAudience.inferredDemographic);
    yPos += 3;
    addSubTitle("Psychographics");
    targetAudience.psychographics.forEach(p => addBullet(p));
    yPos += 5;

    // Messaging Strategy
    addTitle("Messaging Strategy");
    addSubTitle("Value Proposition");
    addText(messaging.valueProposition);
    yPos += 3;
    addSubTitle("Call-to-Action Style");
    addText(messaging.callToActionStyle);
    yPos += 3;
    addSubTitle("Key Themes");
    messaging.keyThemes.forEach(t => addBullet(t));
    yPos += 5;

    // Recommendations
    addTitle("Strategic Recommendations");
    addSubTitle("Do This");
    recommendations.doThis.forEach(r => addBullet(r));
    yPos += 3;
    addSubTitle("Avoid This");
    recommendations.avoidThis.forEach(r => addBullet(r));
    yPos += 3;
    if (recommendations.contentIdeas.length > 0) {
      addSubTitle("Content Ideas");
      recommendations.contentIdeas.forEach(r => addBullet(r));
    }

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(167, 163, 154);
    doc.text("Generated by VisualBrief AI", margin, yPos);

    doc.save("creative-brief.pdf");
  };

  // Stats for the header cards
  const stats = [
    { label: 'Colors', value: 1 + visualStyle.colorPalette.secondary.length + 1, icon: Palette },
    { label: 'Traits', value: brandVoice.personality.length, icon: MessageSquare },
    { label: 'Themes', value: messaging.keyThemes.length, icon: Lightbulb },
    { label: 'Pages', value: 3, icon: CheckCircle2 },
  ];

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20 text-success mb-4">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="font-display text-h1 text-text-primary mb-2">Your Creative Brief is Ready!</h2>
        <p className="text-body text-text-secondary">
          We've analyzed {sourceImages.length} {sourceImages.length === 1 ? 'asset' : 'assets'} and created a comprehensive creative brief document.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-card border border-border-dark rounded-card p-4 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-btn bg-accent-blue/10 text-accent-blue mb-2">
              <stat.icon size={16} />
            </div>
            <div className="text-h2 font-display text-text-primary">{stat.value}</div>
            <div className="text-caption text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PDF Preview - Left Column */}
        <div className="lg:col-span-2">
          <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-dark bg-bg-secondary/50">
              <span className="text-body-sm text-text-secondary font-medium">PDF Preview</span>
              <span className="text-caption text-text-muted">3 pages</span>
            </div>

            {/* PDF Preview Content */}
            <div className="p-6">
              <div className="bg-white rounded-btn p-6 shadow-sm">
                <h3 className="text-[#1A1A1E] font-semibold text-body-lg mb-1">Creative Brief</h3>
                <p className="text-text-muted text-caption mb-4">Brand & Design Style Guide</p>

                {/* Color swatches preview */}
                <div className="flex gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-btn-sm shadow-sm"
                    style={{ backgroundColor: visualStyle.colorPalette.primary }}
                  />
                  {visualStyle.colorPalette.secondary.slice(0, 2).map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-btn-sm shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div
                    className="w-8 h-8 rounded-btn-sm shadow-sm"
                    style={{ backgroundColor: visualStyle.colorPalette.accent }}
                  />
                </div>

                {/* Brief preview content */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-caption text-text-muted">Value Proposition</span>
                    <p className="text-[#444] text-body-sm line-clamp-2">{messaging.valueProposition}</p>
                  </div>
                  <div>
                    <span className="text-caption text-text-muted">Target Audience</span>
                    <p className="text-[#444] text-body-sm line-clamp-2">{targetAudience.inferredDemographic}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-caption text-text-muted">
                  <span>Version: 1.0</span>
                  <span>Generated: {new Date(brief.meta.analyzedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Download & What's Included */}
        <div className="space-y-4">
          {/* Download Card */}
          <div className="bg-bg-card border border-border-dark rounded-card p-5">
            <h4 className="font-semibold text-body text-text-primary mb-2">Download Creative Brief</h4>
            <p className="text-body-sm text-text-secondary mb-4">
              Get your professionally formatted PDF brief, ready to share with your team.
            </p>
            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-blue text-white rounded-btn font-medium text-body hover:bg-accent-blue-hover transition-colors shadow-glow-blue"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>

          {/* What's Included */}
          <div className="bg-bg-card border border-border-dark rounded-card p-5">
            <h4 className="font-semibold text-body text-text-primary mb-3">What's Included</h4>
            <ul className="space-y-2">
              {[
                'Visual identity & color palette',
                'Brand voice analysis',
                'Typography specifications',
                'Target audience insights',
                'Messaging strategy',
                'Strategic recommendations',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* New Analysis */}
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-secondary border border-border-dark text-text-secondary rounded-btn font-medium text-body-sm hover:bg-bg-hover hover:text-text-primary transition-colors"
          >
            <RotateCcw size={16} />
            Start New Analysis
          </button>
        </div>
      </div>

      {/* Extracted Details */}
      <div className="space-y-4">
        {/* Color Palette */}
        <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-dark flex items-center gap-3">
            <div className="p-2 bg-accent-blue/10 rounded-btn">
              <Palette className="text-accent-blue" size={16} />
            </div>
            <h3 className="font-semibold text-body text-text-primary">Extracted Color Palette</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-4">
              {/* Primary */}
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-card shadow-card border border-border-dark"
                  style={{ backgroundColor: visualStyle.colorPalette.primary }}
                />
                <p className="text-caption text-text-muted mt-2 font-mono">{visualStyle.colorPalette.primary}</p>
                <p className="text-caption text-text-secondary">Primary</p>
              </div>
              {/* Secondary colors */}
              {visualStyle.colorPalette.secondary.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-16 h-16 rounded-card shadow-card border border-border-dark"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-caption text-text-muted mt-2 font-mono">{color}</p>
                  <p className="text-caption text-text-secondary">Secondary</p>
                </div>
              ))}
              {/* Accent */}
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-card shadow-card border border-border-dark"
                  style={{ backgroundColor: visualStyle.colorPalette.accent }}
                />
                <p className="text-caption text-text-muted mt-2 font-mono">{visualStyle.colorPalette.accent}</p>
                <p className="text-caption text-text-secondary">Accent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography System */}
        <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-dark flex items-center gap-3">
            <div className="p-2 bg-accent-blue/10 rounded-btn">
              <MessageSquare className="text-accent-blue" size={16} />
            </div>
            <h3 className="font-semibold text-body text-text-primary">Brand Voice & Typography</h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-caption uppercase tracking-wider text-text-muted font-semibold mb-2">Typography Style</h4>
              <p className="text-body text-text-primary mb-1 font-medium">{visualStyle.typography.style}</p>
              <p className="text-body-sm text-text-secondary">{visualStyle.typography.hierarchy}</p>
            </div>
            <div>
              <h4 className="text-caption uppercase tracking-wider text-text-muted font-semibold mb-2">Tone Profile</h4>
              <p className="text-body-sm text-text-secondary">{brandVoice.tone}</p>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Do This */}
          <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border-dark flex items-center gap-2 bg-success/5">
              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="text-success" size={12} />
              </div>
              <h4 className="text-body-sm font-semibold text-success">Do this</h4>
            </div>
            <div className="p-4 space-y-2">
              {recommendations.doThis.map((item, i) => (
                <p key={i} className="text-body-sm text-text-secondary bg-bg-hover p-2.5 rounded-btn border border-border-dark">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Avoid This */}
          <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border-dark flex items-center gap-2 bg-error/5">
              <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center">
                <XIcon className="text-error" size={12} />
              </div>
              <h4 className="text-body-sm font-semibold text-error">Avoid this</h4>
            </div>
            <div className="p-4 space-y-2">
              {recommendations.avoidThis.map((item, i) => (
                <p key={i} className="text-body-sm text-text-secondary bg-bg-hover p-2.5 rounded-btn border border-border-dark">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Content Ideas */}
          <div className="bg-bg-card border border-border-dark rounded-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border-dark flex items-center gap-2 bg-accent-blue/5">
              <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center">
                <Sparkles className="text-accent-blue" size={12} />
              </div>
              <h4 className="text-body-sm font-semibold text-accent-blue">Content ideas</h4>
            </div>
            <div className="p-4 space-y-2">
              {recommendations.contentIdeas.map((item, i) => (
                <p key={i} className="text-body-sm text-text-secondary bg-bg-hover p-2.5 rounded-btn border border-border-dark">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefResult;
