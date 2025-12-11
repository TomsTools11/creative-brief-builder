import React from 'react';
import { Download, RotateCcw, Palette, MessageSquare, Users, Lightbulb, Check, X as XIcon, Sparkles } from 'lucide-react';
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

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border-light">
        <div>
          <h2 className="text-h2 font-bold text-primary-dark">Creative Brief</h2>
          <p className="text-text-secondary text-body-sm mt-1">
            Based on {sourceImages.length} analyzed {sourceImages.length === 1 ? 'asset' : 'assets'} • Generated {new Date(brief.meta.analyzedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 text-body-sm font-medium text-primary-text bg-transparent border border-border-light rounded-btn hover:border-primary-text hover:bg-bg-subtle transition-all duration-200"
          >
            <RotateCcw size={16} />
            New analysis
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 text-body-sm font-medium text-white bg-primary-text rounded-btn hover:bg-primary-dark transition-all duration-200 shadow-card"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Brief Content */}
      <div className="space-y-6">

        {/* Visual Identity Section */}
        <section className="bg-white rounded-card border border-border-light shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light bg-bg-subtle flex items-center gap-3">
            <div className="p-2 bg-primary-accent/10 rounded-btn">
              <Palette className="text-primary-accent" size={18} />
            </div>
            <h3 className="font-semibold text-body-lg text-primary-dark">Visual Identity</h3>
          </div>
          <div className="p-5 space-y-6">
            {/* Color Palette */}
            <div>
              <h4 className="text-caption uppercase tracking-wider text-text-secondary font-semibold mb-3">Color Palette</h4>
              <div className="flex flex-wrap gap-3">
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-btn shadow-sm ring-1 ring-border-light"
                    style={{ backgroundColor: visualStyle.colorPalette.primary }}
                  />
                  <span className="text-caption text-text-secondary mt-1.5 block font-mono">{visualStyle.colorPalette.primary}</span>
                  <span className="text-caption text-text-secondary">Primary</span>
                </div>
                {visualStyle.colorPalette.secondary.map((color, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="w-14 h-14 rounded-btn shadow-sm ring-1 ring-border-light"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-caption text-text-secondary mt-1.5 block font-mono">{color}</span>
                    <span className="text-caption text-text-secondary">Secondary</span>
                  </div>
                ))}
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-btn shadow-sm ring-1 ring-border-light"
                    style={{ backgroundColor: visualStyle.colorPalette.accent }}
                  />
                  <span className="text-caption text-text-secondary mt-1.5 block font-mono">{visualStyle.colorPalette.accent}</span>
                  <span className="text-caption text-text-secondary">Accent</span>
                </div>
              </div>
            </div>

            {/* Typography & Motifs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-caption uppercase tracking-wider text-text-secondary font-semibold mb-2">Typography</h4>
                <div className="bg-bg-subtle p-4 rounded-btn border border-border-light">
                  <p className="font-medium text-primary-dark text-body">{visualStyle.typography.style}</p>
                  <p className="text-body-sm text-text-secondary mt-1">{visualStyle.typography.hierarchy}</p>
                </div>
              </div>
              <div>
                <h4 className="text-caption uppercase tracking-wider text-text-secondary font-semibold mb-2">Visual Motifs</h4>
                <div className="flex flex-wrap gap-2">
                  {visualStyle.visualMotifs.map((m, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary-accent/10 text-primary-accent text-body-sm rounded-full font-medium">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Voice Section */}
        <section className="bg-white rounded-card border border-border-light shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light bg-bg-subtle flex items-center gap-3">
            <div className="p-2 bg-accent-dark/10 rounded-btn">
              <MessageSquare className="text-accent-dark" size={18} />
            </div>
            <h3 className="font-semibold text-body-lg text-primary-dark">Brand Voice & Tone</h3>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <h4 className="text-caption uppercase tracking-wider text-text-secondary font-semibold mb-2">Tone Profile</h4>
              <p className="text-primary-text text-body leading-relaxed bg-bg-subtle p-4 rounded-btn border border-border-light">
                {brandVoice.tone}
              </p>
            </div>
            <div>
              <h4 className="text-caption uppercase tracking-wider text-text-secondary font-semibold mb-2">Emotional Appeal</h4>
              <p className="text-primary-text text-body">{brandVoice.emotionalAppeal}</p>
            </div>
            <div>
              <h4 className="text-caption uppercase tracking-wider text-text-secondary font-semibold mb-2">Personality Traits</h4>
              <div className="flex flex-wrap gap-2">
                {brandVoice.personality.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-accent-dark/10 text-accent-dark text-body-sm rounded-full font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Audience & Messaging Section */}
        <section className="bg-white rounded-card border border-border-light shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light bg-bg-subtle flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-btn">
              <Users className="text-success" size={18} />
            </div>
            <h3 className="font-semibold text-body-lg text-primary-dark">Audience & Messaging</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Target Audience */}
              <div className="space-y-4">
                <h4 className="text-body font-semibold text-primary-dark border-b border-border-light pb-2">Target Audience</h4>
                <div>
                  <span className="text-caption uppercase tracking-wider text-text-secondary font-semibold">Demographics</span>
                  <div className="mt-2 bg-success/5 border border-success/20 p-3 rounded-btn">
                    <p className="text-primary-text text-body">{targetAudience.inferredDemographic}</p>
                  </div>
                </div>
                <div>
                  <span className="text-caption uppercase tracking-wider text-text-secondary font-semibold">Psychographics</span>
                  <ul className="mt-2 space-y-2">
                    {targetAudience.psychographics.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-body text-primary-text">
                        <span className="text-success mt-0.5 text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Messaging Strategy */}
              <div className="space-y-4">
                <h4 className="text-body font-semibold text-primary-dark border-b border-border-light pb-2">Messaging Strategy</h4>
                <div>
                  <span className="text-caption uppercase tracking-wider text-text-secondary font-semibold">Value Proposition</span>
                  <p className="text-primary-text text-body mt-2">{messaging.valueProposition}</p>
                </div>
                <div>
                  <span className="text-caption uppercase tracking-wider text-text-secondary font-semibold">Call-to-Action Style</span>
                  <p className="text-primary-text text-body mt-2">{messaging.callToActionStyle}</p>
                </div>
                <div>
                  <span className="text-caption uppercase tracking-wider text-text-secondary font-semibold">Key Themes</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {messaging.keyThemes.map((t, i) => (
                      <span key={i} className="text-body-sm border border-border-light text-primary-text px-2.5 py-1 rounded-btn-sm bg-bg-subtle">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section className="bg-white rounded-card border border-border-light shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light bg-bg-subtle flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-btn">
              <Lightbulb className="text-warning" size={18} />
            </div>
            <h3 className="font-semibold text-body-lg text-primary-dark">Strategic Recommendations</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Do This */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="text-success" size={12} />
                  </div>
                  <h4 className="text-body font-semibold text-success">Do this</h4>
                </div>
                <ul className="space-y-2">
                  {recommendations.doThis.map((item, i) => (
                    <li key={i} className="text-body-sm text-primary-text bg-success/5 p-3 rounded-btn border border-success/15">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid This */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center">
                    <XIcon className="text-error" size={12} />
                  </div>
                  <h4 className="text-body font-semibold text-error">Avoid this</h4>
                </div>
                <ul className="space-y-2">
                  {recommendations.avoidThis.map((item, i) => (
                    <li key={i} className="text-body-sm text-primary-text bg-error/5 p-3 rounded-btn border border-error/15">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Ideas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-primary-accent/20 flex items-center justify-center">
                    <Sparkles className="text-primary-accent" size={12} />
                  </div>
                  <h4 className="text-body font-semibold text-primary-accent">Content ideas</h4>
                </div>
                <ul className="space-y-2">
                  {recommendations.contentIdeas.map((item, i) => (
                    <li key={i} className="text-body-sm text-primary-text bg-primary-accent/5 p-3 rounded-btn border border-primary-accent/15">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BriefResult;
