"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import type { ImageUploadProps } from "@/types";

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ImageUpload({
  value,
  onChange,
  maxSize = DEFAULT_MAX_SIZE,
  accept = "image/*",
  preview = true,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > maxSize) {
        setError(
          `File is too large. Maximum size is ${Math.round(
            maxSize / (1024 * 1024)
          )} MB.`
        );
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Only image files are accepted.");
        return;
      }
      onChange(file as any);
    },
    [maxSize, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { [accept]: [] },
    multiple: false,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        setError("File type not accepted or file is too large.");
        return;
      }
      if (accepted.length > 0) {
        processFile(accepted[0]);
      }
    },
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      {preview && value && (typeof value === 'string' || value instanceof File) && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={typeof value === 'string' ? value : URL.createObjectURL(value)}
            alt="Product preview"
            className="h-32 w-32 object-cover rounded-lg border border-gray-200"
          />
          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
          {/* Change image overlay icon */}
          <label className="absolute bottom-2 right-2 flex items-center justify-center h-7 w-7 rounded-full bg-white border border-gray-300 shadow cursor-pointer hover:bg-gray-100 transition-colors">
            <Upload className="h-4 w-4 text-gray-600" />
            <input
              type="file"
              className="sr-only"
              accept={accept}
              onChange={handleFileInput}
            />
          </label>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-6 py-8 cursor-pointer transition-colors ${
            isDragActive
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600 text-center">
            {isDragActive ? (
              "Drop the image here…"
            ) : (
              <>
                Drag &amp; drop an image here, or{" "}
                <span className="text-green-600 font-medium">click to browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, GIF, WebP — max {Math.round(maxSize / (1024 * 1024))} MB
          </p>
        </div>
      )}

      {/* Or pick file when preview is already shown */}
      {/* Removed extra Change Image button, overlay icon is now the only change trigger */}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}