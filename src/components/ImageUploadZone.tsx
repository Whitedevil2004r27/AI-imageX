"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        animate={isDragActive ? { 
          scale: 1.02,
          borderColor: "rgba(6, 182, 212, 0.8)"
        } : {}}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isDragActive 
            ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(6,182,212,0.15)]" 
            : "border-border bg-surface/30 hover:border-primary/50 hover:bg-surface/50"
        }`}
      >
        <input {...getInputProps()} />
        
        {/* Animated scan line when dragging */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-md mx-auto group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src={preview}
                alt="Diagnostic Preview"
                layoutId="preview-image"
                className="rounded-xl border border-border shadow-lg max-h-64 object-cover w-full"
              />
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full text-text-primary hover:text-error border border-border transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-2 right-2 flex items-center gap-1 bg-success/90 text-text-primary text-xs px-2.5 py-1 rounded-full shadow border border-success/20"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ShieldCheck className="w-3 h-3" />
                </motion.span>
                EXIF Stripped
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <motion.div 
                animate={isDragActive ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: isDragActive ? 0.5 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="p-4 rounded-full bg-surface/80 text-accent shadow-inner"
              >
                {isDragActive ? (
                  <ImageIcon className="w-10 h-10" />
                ) : (
                  <Upload className="w-10 h-10" />
                )}
              </motion.div>
              <div>
                <motion.p 
                  animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                  className="text-text-primary font-semibold text-base"
                >
                  {isDragActive ? "Drop diagnostic image here..." : "Drag & drop medical image here"}
                </motion.p>
                <p className="text-text-secondary text-sm mt-1">
                  Supports JPG, PNG, and DICOM formats (Up to 10MB)
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, borderColor: "rgba(124, 58, 237, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl bg-surface text-text-primary text-sm font-medium border border-border transition-colors"
              >
                Browse Files
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Built-in Sample Images Gallery */}
      <AnimatePresence>
        {!preview && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 p-4 rounded-xl border border-border bg-surface/30"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ImageIcon className="w-4 h-4" />
              </motion.span>
              Or try a sample clinical image:
            </motion.p>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {[
                { url: "/samples/chest_xray.jpg", name: "Chest X-Ray" },
                { url: "/samples/brain_mri.jpg", name: "Brain MRI" },
                { url: "/samples/wrist_fracture.jpg", name: "Wrist Fracture" },
                { url: "/samples/chest_ct.jpg", name: "Chest CT Scan" },
              ].map((sample, index) => (
                <motion.button
                  key={sample.url}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
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
                  className="flex-shrink-0 group relative rounded-lg overflow-hidden border border-border hover:border-accent transition-all duration-300 w-28 h-28"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={sample.url} 
                    alt={sample.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end justify-center pb-2"
                  >
                    <span className="text-xs font-semibold text-text-primary text-center px-1">
                      {sample.name}
                    </span>
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
