import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
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
    <div className="w-full space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-card p-8 transition-all duration-200 text-center ${
          isDragging
            ? 'border-accent-blue bg-accent-blue/5'
            : 'border-border-light hover:border-text-secondary bg-bg-secondary/30'
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

        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-accent-blue/10 text-accent-blue rounded-full">
            <Upload size={24} />
          </div>
          <div>
            <p className="text-body font-medium text-text-primary">
              Drop images here or click to browse
            </p>
            <p className="text-text-secondary mt-1 text-body-sm">
              Supports JPG, PNG, WebP (max {MAX_IMAGES} images, 5MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-error/10 text-error text-body-sm rounded-btn border border-error/30">
          {error}
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-btn overflow-hidden border border-border-dark aspect-square bg-bg-secondary"
            >
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
                  className="absolute top-2 right-2 p-1.5 bg-bg-primary/90 text-text-secondary rounded-full hover:bg-error hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${img.name}`}
                >
                  <X size={14} />
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-caption text-white truncate">{img.name}</p>
              </div>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, MAX_IMAGES - images.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border-2 border-dashed border-border-dark rounded-btn aspect-square flex flex-col items-center justify-center text-text-muted bg-bg-secondary/20 cursor-pointer hover:border-border-light transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={20} />
              <span className="text-caption mt-1.5">Slot {images.length + i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;
