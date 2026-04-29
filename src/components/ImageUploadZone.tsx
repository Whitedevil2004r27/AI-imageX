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

      {/* Built-in Sample Images Gallery */}
      {!preview && (
        <div className="mt-6 p-4 rounded-xl border border-border bg-surface/30">
          <p className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Or try a sample clinical image:
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {[
              { url: "/samples/chest_xray.jpg", name: "Chest X-Ray" },
              { url: "/samples/brain_mri.jpg", name: "Brain MRI" },
              { url: "/samples/wrist_fracture.jpg", name: "Wrist Fracture" },
              { url: "/samples/chest_ct.jpg", name: "Chest CT Scan" },
            ].map((sample) => (
              <button
                key={sample.url}
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const res = await fetch(sample.url);
                    const blob = await res.blob();
                    const file = new File([blob], sample.name + ".jpg", { type: blob.type });
                    onImageSelect(file);
                    setPreview(sample.url);
                  } catch (err) {
                    console.error("Failed to load sample image", err);
                  }
                }}
                className="flex-shrink-0 group relative rounded-lg overflow-hidden border border-border hover:border-accent hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300 w-28 h-28"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={sample.url} 
                  alt={sample.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                  <span className="text-xs font-semibold text-text-primary text-center px-1">
                    {sample.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
