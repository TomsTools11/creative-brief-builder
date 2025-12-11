import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { MAX_IMAGES, MAX_FILE_SIZE_BYTES } from '../constants';
import { ProcessedImage } from '../types';
import { resizeImage, stripBase64Prefix } from '../services/imageUtils';

interface UploadZoneProps {
  onImagesChange: (images: ProcessedImage[]) => void;
  images: ProcessedImage[];
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImagesChange, images, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const newImages: ProcessedImage[] = [...images];
    
    if (newImages.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File ${file.name} exceeds 5MB limit.`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not a valid image.`);
        continue;
      }

      try {
        const { base64, mimeType } = await resizeImage(file);
        newImages.push({
          id: crypto.randomUUID(),
          name: file.name,
          url: base64,
          base64Data: stripBase64Prefix(base64),
          mimeType,
          size: file.size,
        });
      } catch (e) {
        console.error("Error processing image", e);
        setError("Failed to process image. Please try again.");
      }
    }

    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset value so same file can be selected again if deleted
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    if (isProcessing) return;
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-card p-10 transition-all duration-200 text-center ${
          isDragging
            ? 'border-accent-teal bg-accent-teal/5'
            : 'border-gray-300 hover:border-near-black bg-white'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-accent-teal/10 text-accent-teal rounded-full">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-h3 font-bold text-near-black">
              Drop images here or click to browse
            </h3>
            <p className="text-text-secondary mt-1 text-body-lg">
              Support JPG, PNG, WEBP (Max {MAX_IMAGES} images, 5MB each)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-error-red text-body-lg rounded-card border border-error-red/30">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-card overflow-hidden border border-gray-200 shadow-card aspect-square bg-gray-100">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              {!isProcessing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-near-black rounded-full hover:bg-error-red hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-card"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {/* Placeholder slots to show remaining capacity */}
          {Array.from({ length: Math.max(0, MAX_IMAGES - images.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-gray-200 rounded-card aspect-square flex flex-col items-center justify-center text-gray-300 bg-gray-50/50">
               <ImageIcon size={24} />
               <span className="text-body-sm mt-2 font-medium">Slot {images.length + i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;
