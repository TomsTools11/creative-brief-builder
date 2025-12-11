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
          <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
          <p className="text-slate-500">Based on {sourceImages.length} analyzed assets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Analyze New Images
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visual Style Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Palette className="text-blue-600" size={20} />
            <h3 className="font-semibold text-slate-800">Visual Identity</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Color Palette</h4>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <div
                    className="w-16 h-16 rounded-lg shadow-inner ring-1 ring-slate-200"
                    style={{ backgroundColor: visualStyle.colorPalette.primary }}
                  />
                  <span className="text-xs text-slate-500 font-mono block text-center">{visualStyle.colorPalette.primary}</span>
                </div>
                {visualStyle.colorPalette.secondary.map((color, i) => (
                  <div key={i} className="space-y-1">
                    <div
                      className="w-16 h-16 rounded-lg shadow-inner ring-1 ring-slate-200"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-slate-500 font-mono block text-center">{color}</span>
                  </div>
                ))}
                 <div className="space-y-1">
                  <div
                    className="w-16 h-16 rounded-lg shadow-inner ring-1 ring-slate-200"
                    style={{ backgroundColor: visualStyle.colorPalette.accent }}
                  />
                  <span className="text-xs text-slate-500 font-mono block text-center">{visualStyle.colorPalette.accent}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Typography</h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-800">{visualStyle.typography.style}</p>
                    <p className="text-sm text-slate-500 mt-1">{visualStyle.typography.hierarchy}</p>
                </div>
              </div>
              <div>
                 <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Motifs</h4>
                 <div className="flex flex-wrap gap-2">
                    {visualStyle.visualMotifs.map((m, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{m}</span>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Voice Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={20} />
            <h3 className="font-semibold text-slate-800">Brand Voice & Tone</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
               <h4 className="text-sm font-medium text-slate-700 mb-2">Tone Profile</h4>
               <p className="text-slate-600 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                 {brandVoice.tone}
               </p>
            </div>
            <div>
               <h4 className="text-sm font-medium text-slate-700 mb-2">Emotional Appeal</h4>
               <p className="text-slate-600 text-sm">{brandVoice.emotionalAppeal}</p>
            </div>
            <div>
               <h4 className="text-sm font-medium text-slate-700 mb-2">Personality Traits</h4>
               <div className="flex flex-wrap gap-2">
                 {brandVoice.personality.map((p, i) => (
                   <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full font-medium">
                     {p}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Messaging & Audience Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Users className="text-emerald-600" size={20} />
            <h3 className="font-semibold text-slate-800">Audience & Messaging</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Target Audience</h4>
              <div className="space-y-3">
                 <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-emerald-900 font-medium">{targetAudience.inferredDemographic}</p>
                 </div>
                 <ul className="space-y-2">
                    {targetAudience.psychographics.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-emerald-500 mt-1">•</span> {item}
                        </li>
                    ))}
                 </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Messaging Strategy</h4>
              <div className="space-y-4">
                  <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">Value Prop</span>
                      <p className="text-slate-700 text-sm mt-1">{messaging.valueProposition}</p>
                  </div>
                  <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">CTA Style</span>
                      <p className="text-slate-700 text-sm mt-1">{messaging.callToActionStyle}</p>
                  </div>
                   <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">Key Themes</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                         {messaging.keyThemes.map((t, i) => (
                             <span key={i} className="text-xs border border-slate-200 text-slate-600 px-2 py-1 rounded">{t}</span>
                         ))}
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            <h3 className="font-semibold text-slate-800">Strategic Recommendations</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-green-700 mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Do This
                </h4>
                <ul className="space-y-2">
                    {recommendations.doThis.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 bg-green-50/50 p-2 rounded border border-green-100">{item}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Avoid This
                </h4>
                 <ul className="space-y-2">
                    {recommendations.avoidThis.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 bg-red-50/50 p-2 rounded border border-red-100">{item}</li>
                    ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Content Ideas
                </h4>
                 <ul className="space-y-2">
                    {recommendations.contentIdeas.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 bg-blue-50/50 p-2 rounded border border-blue-100">{item}</li>
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
