import React, { useRef, useCallback, useEffect } from 'react';

const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-500 mb-4">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
    </svg>
);


interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled && event.dataTransfer.files && event.dataTransfer.files[0]) {
        onImageUpload(event.dataTransfer.files[0]);
    }
  }, [onImageUpload, disabled]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handlePaste = useCallback((event: ClipboardEvent) => {
    if (disabled) return;
    const items = event.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          onImageUpload(file);
          break; // Stop after finding the first image
        }
      }
    }
  }, [onImageUpload, disabled]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <div 
        className={`w-full p-6 border-2 border-dashed rounded-lg transition-colors duration-200 ${disabled ? 'border-gray-700 cursor-not-allowed' : 'border-gray-600 hover:border-purple-500 cursor-pointer'}`}
        onClick={!disabled ? handleClick : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        aria-label="Image uploader: Click, drag and drop, or paste an image"
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloudIcon />
        <p className="font-semibold text-lg">Click, drag & drop, or paste</p>
        <p className="text-sm text-gray-400">PNG, JPG, WEBP, GIF, AVIF</p>
      </div>
    </div>
  );
};

export default React.memo(ImageUploader);