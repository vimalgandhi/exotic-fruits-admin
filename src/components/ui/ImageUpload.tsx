'use client';

import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, X, Crop as CropIcon, Check } from 'lucide-react';
import type { ImageUploadProps } from '@/types';

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ImageUpload({
  value,
  onChange,
  maxSize = DEFAULT_MAX_SIZE,
  accept = 'image/*',
  preview = true,
  crop = true,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropState, setCropState] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (file.size > maxSize) {
        setError(`File is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))} MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Only image files are accepted.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (crop) {
          setRawSrc(result);
          setIsCropping(true);
        } else {
          onChange(result);
        }
      };
      reader.readAsDataURL(file);
    },
    [maxSize, crop, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { [accept]: [] },
    multiple: false,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        setError('File type not accepted or file is too large.');
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
    // reset input so the same file can be re-selected
    e.target.value = '';
  };

  const applyCrop = () => {
    if (!imgRef.current || !rawSrc) return;
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const pixelCrop =
      cropState.unit === '%'
        ? {
            x: (cropState.x / 100) * img.width,
            y: (cropState.y / 100) * img.height,
            width: (cropState.width / 100) * img.width,
            height: (cropState.height / 100) * img.height,
          }
        : cropState;

    canvas.width = pixelCrop.width * scaleX;
    canvas.height = pixelCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      img,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    onChange(base64);
    setRawSrc(null);
    setIsCropping(false);
  };

  const cancelCrop = () => {
    setRawSrc(null);
    setIsCropping(false);
  };

  const handleRemove = () => {
    onChange('');
    setRawSrc(null);
    setIsCropping(false);
    setError(null);
  };

  // Crop modal
  if (isCropping && rawSrc) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Crop Image</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden max-w-lg">
          <ReactCrop
            crop={cropState}
            onChange={(c) => setCropState(c)}
            aspect={undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={rawSrc}
              alt="Crop preview"
              className="max-w-full"
            />
          </ReactCrop>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyCrop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <Check className="h-4 w-4" />
            Apply Crop
          </button>
          <button
            type="button"
            onClick={cancelCrop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {preview && value && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Product preview"
            className="h-32 w-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
          {crop && (
            <button
              type="button"
              onClick={() => {
                setRawSrc(value);
                setIsCropping(true);
              }}
              className="absolute -bottom-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Crop image"
            >
              <CropIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-6 py-8 cursor-pointer transition-colors ${
            isDragActive
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600 text-center">
            {isDragActive ? (
              'Drop the image here…'
            ) : (
              <>
                Drag &amp; drop an image here, or{' '}
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
      {value && (
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
          <Upload className="h-4 w-4" />
          Change Image
          <input
            type="file"
            className="sr-only"
            accept={accept}
            onChange={handleFileInput}
          />
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
