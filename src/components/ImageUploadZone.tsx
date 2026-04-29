"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, ShieldCheck } from "lucide-react";

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
}

export default function ImageUploadZone({ onImageSelect }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/dicom': ['.dcm']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative ${
          isDragActive 
            ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
            : "border-border bg-surface/30 hover:border-primary/50 hover:bg-surface/50"
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative max-w-md mx-auto group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Diagnostic Preview"
              className="rounded-xl border border-border shadow-lg max-h-64 object-cover w-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full text-text-primary hover:bg-error/20 hover:text-error border border-border transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-success/90 text-text-primary text-xs px-2.5 py-1 rounded-full shadow border border-success/20">
              <ShieldCheck className="w-3 h-3" />
              EXIF Stripped
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-surface/80 text-accent shadow-inner">
              {isDragActive ? (
                <ImageIcon className="w-10 h-10 animate-bounce" />
              ) : (
                <Upload className="w-10 h-10" />
              )}
            </div>
            <div>
              <p className="text-text-primary font-semibold text-base">
                {isDragActive ? "Drop diagnostic image here..." : "Drag & drop medical image here"}
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Supports JPG, PNG, and DICOM formats (Up to 10MB)
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-surface text-text-primary text-sm font-medium border border-border hover:border-primary/50 transition-colors"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
