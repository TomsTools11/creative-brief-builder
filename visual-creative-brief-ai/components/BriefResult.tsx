import React from 'react';
import { Download, Palette, Type, MessageSquare, Users, Lightbulb } from 'lucide-react';
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
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text(text, margin, yPos);
        yPos += lineHeight * 1.5;
    };

    const addSubTitle = (text: string) => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        doc.text(text, margin, yPos);
        yPos += lineHeight;
    };

    const addText = (text: string, indent = 0) => {
         if (yPos > 270) { doc.addPage(); yPos = 20; }
         doc.setFontSize(10);
         doc.setFont("helvetica", "normal");
         doc.setTextColor(80, 80, 80);
         const splitText = doc.splitTextToSize(text, contentWidth - indent);
         doc.text(splitText, margin + indent, yPos);
         yPos += (splitText.length * lineHeight) + 2;
    };

    // Header
    doc.setFontSize(22);
    doc.text("Creative Brief Analysis", margin, yPos);
    yPos += lineHeight * 2;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date(brief.meta.analyzedAt).toLocaleDateString()}`, margin, yPos);
    yPos += lineHeight * 2;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);

    // Visual Style
    addTitle("1. Visual Style");
    addSubTitle("Color Palette");
    addText(`Primary: ${visualStyle.colorPalette.primary}`);
    addText(`Secondary: ${visualStyle.colorPalette.secondary.join(', ')}`);
    addText(`Accent: ${visualStyle.colorPalette.accent}`);
    
    addSubTitle("Typography");
    addText(`Style: ${visualStyle.typography.style}`);
    addText(`Hierarchy: ${visualStyle.typography.hierarchy}`);
    
    // Brand Voice
    addTitle("2. Brand Voice");
    addText(`Tone: ${brandVoice.tone}`);
    addText(`Emotional Appeal: ${brandVoice.emotionalAppeal}`);
    addText("Personality Keywords:");
    brandVoice.personality.forEach(p => addText(`• ${p}`, 5));

    // Messaging
    addTitle("3. Messaging Strategy");
    addText(`Value Proposition: ${messaging.valueProposition}`);
    addText(`Call to Action: ${messaging.callToActionStyle}`);
    addText("Key Themes:");
    messaging.keyThemes.forEach(t => addText(`• ${t}`, 5));

    // Audience
    addTitle("4. Target Audience");
    addText(`Demographic: ${targetAudience.inferredDemographic}`);
    addText("Psychographics:");
    targetAudience.psychographics.forEach(p => addText(`• ${p}`, 5));

    // Recommendations
    addTitle("5. Recommendations");
    addSubTitle("Do This:");
    recommendations.doThis.forEach(r => addText(`• ${r}`, 5));
    addSubTitle("Avoid This:");
    recommendations.avoidThis.forEach(r => addText(`• ${r}`, 5));
    
    doc.save("creative-brief.pdf");
  };

  return (
    <div className="animate-fade-in w-full max-w-4xl mx-auto pb-20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-h2 font-bold text-near-black">Analysis results</h2>
          <p className="text-text-secondary text-body-lg">Based on {sourceImages.length} analyzed assets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-body-lg font-medium text-near-black bg-transparent border border-near-black rounded-btn hover:bg-near-black hover:text-white transition-all duration-200"
          >
            Analyze new images
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-body-lg font-medium text-white bg-near-black rounded-btn hover:bg-near-black/90 transition-all duration-200 shadow-card"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Visual Style Card */}
        <div className="bg-white rounded-card shadow-card border border-gray-200 overflow-hidden hover:shadow-card-hover transition-all duration-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Palette className="text-accent-teal" size={20} />
            <h3 className="font-bold text-near-black text-h3">Visual identity</h3>
          </div>
          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-body-sm uppercase tracking-wider text-text-secondary font-semibold mb-3">Color palette</h4>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <div
                    className="w-16 h-16 rounded-btn shadow-inner ring-1 ring-gray-200"
                    style={{ backgroundColor: visualStyle.colorPalette.primary }}
                  />
                  <span className="text-body-sm text-text-secondary font-mono block text-center">{visualStyle.colorPalette.primary}</span>
                </div>
                {visualStyle.colorPalette.secondary.map((color, i) => (
                  <div key={i} className="space-y-1">
                    <div
                      className="w-16 h-16 rounded-btn shadow-inner ring-1 ring-gray-200"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-body-sm text-text-secondary font-mono block text-center">{color}</span>
                  </div>
                ))}
                 <div className="space-y-1">
                  <div
                    className="w-16 h-16 rounded-btn shadow-inner ring-1 ring-gray-200"
                    style={{ backgroundColor: visualStyle.colorPalette.accent }}
                  />
                  <span className="text-body-sm text-text-secondary font-mono block text-center">{visualStyle.colorPalette.accent}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-body-sm uppercase tracking-wider text-text-secondary font-semibold mb-2">Typography</h4>
                <div className="bg-gray-50 p-3 rounded-btn border border-gray-100">
                    <p className="font-medium text-near-black text-body-lg">{visualStyle.typography.style}</p>
                    <p className="text-body-lg text-text-secondary mt-1">{visualStyle.typography.hierarchy}</p>
                </div>
              </div>
              <div>
                 <h4 className="text-body-sm uppercase tracking-wider text-text-secondary font-semibold mb-2">Motifs</h4>
                 <div className="flex flex-wrap gap-2">
                    {visualStyle.visualMotifs.map((m, i) => (
                        <span key={i} className="px-2 py-1 bg-accent-teal/10 text-accent-teal text-body-sm rounded-full font-medium">{m}</span>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Voice Card */}
        <div className="bg-white rounded-card shadow-card border border-gray-200 overflow-hidden hover:shadow-card-hover transition-all duration-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <MessageSquare className="text-accent-blue" size={20} />
            <h3 className="font-bold text-near-black text-h3">Brand voice & tone</h3>
          </div>
          <div className="p-5 space-y-6">
            <div>
               <h4 className="text-body-lg font-medium text-near-black mb-2">Tone profile</h4>
               <p className="text-text-secondary leading-relaxed bg-accent-blue/5 p-3 rounded-btn border border-accent-blue/10 text-body-lg">
                 {brandVoice.tone}
               </p>
            </div>
            <div>
               <h4 className="text-body-lg font-medium text-near-black mb-2">Emotional appeal</h4>
               <p className="text-text-secondary text-body-lg">{brandVoice.emotionalAppeal}</p>
            </div>
            <div>
               <h4 className="text-body-lg font-medium text-near-black mb-2">Personality traits</h4>
               <div className="flex flex-wrap gap-2">
                 {brandVoice.personality.map((p, i) => (
                   <span key={i} className="px-3 py-1 bg-accent-blue/10 text-accent-blue text-body-lg rounded-full font-medium">
                     {p}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Messaging & Audience Card */}
        <div className="bg-white rounded-card shadow-card border border-gray-200 overflow-hidden md:col-span-2 hover:shadow-card-hover transition-all duration-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Users className="text-success-green" size={20} />
            <h3 className="font-bold text-near-black text-h3">Audience & messaging</h3>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-body-lg font-bold text-near-black uppercase tracking-wide">Target audience</h4>
              <div className="space-y-3">
                 <div className="bg-success-green/10 p-4 rounded-btn">
                    <p className="text-near-black font-medium text-body-lg">{targetAudience.inferredDemographic}</p>
                 </div>
                 <ul className="space-y-2">
                    {targetAudience.psychographics.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-body-lg text-text-secondary">
                            <span className="text-success-green mt-1">&#8226;</span> {item}
                        </li>
                    ))}
                 </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-body-lg font-bold text-near-black uppercase tracking-wide">Messaging strategy</h4>
              <div className="space-y-4">
                  <div>
                      <span className="text-body-sm font-semibold text-text-secondary uppercase">Value prop</span>
                      <p className="text-near-black text-body-lg mt-1">{messaging.valueProposition}</p>
                  </div>
                  <div>
                      <span className="text-body-sm font-semibold text-text-secondary uppercase">CTA style</span>
                      <p className="text-near-black text-body-lg mt-1">{messaging.callToActionStyle}</p>
                  </div>
                   <div>
                      <span className="text-body-sm font-semibold text-text-secondary uppercase">Key themes</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                         {messaging.keyThemes.map((t, i) => (
                             <span key={i} className="text-body-sm border border-gray-200 text-text-secondary px-2 py-1 rounded-btn-sm">{t}</span>
                         ))}
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Card */}
        <div className="bg-white rounded-card shadow-card border border-gray-200 overflow-hidden md:col-span-2 hover:shadow-card-hover transition-all duration-200">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Lightbulb className="text-warning-amber" size={20} />
            <h3 className="font-bold text-near-black text-h3">Strategic recommendations</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="flex items-center gap-2 text-body-lg font-bold text-success-green mb-3">
                    <span className="w-2 h-2 rounded-full bg-success-green"></span> Do this
                </h4>
                <ul className="space-y-2">
                    {recommendations.doThis.map((item, i) => (
                        <li key={i} className="text-body-lg text-text-secondary bg-success-green/5 p-2 rounded-btn-sm border border-success-green/20">{item}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-body-lg font-bold text-error-red mb-3">
                    <span className="w-2 h-2 rounded-full bg-error-red"></span> Avoid this
                </h4>
                 <ul className="space-y-2">
                    {recommendations.avoidThis.map((item, i) => (
                        <li key={i} className="text-body-lg text-text-secondary bg-error-red/5 p-2 rounded-btn-sm border border-error-red/20">{item}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-body-lg font-bold text-accent-teal mb-3">
                    <span className="w-2 h-2 rounded-full bg-accent-teal"></span> Content ideas
                </h4>
                 <ul className="space-y-2">
                    {recommendations.contentIdeas.map((item, i) => (
                        <li key={i} className="text-body-lg text-text-secondary bg-accent-teal/5 p-2 rounded-btn-sm border border-accent-teal/20">{item}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BriefResult;
