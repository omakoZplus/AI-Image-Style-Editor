import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import PromptEditor from './components/PromptEditor';
import Loader from './components/Loader';
import { generateImage } from './services/geminiService';
import GenderbendSelector from './components/GenderbendSelector';
import ImageZoomModal from './components/ImageZoomModal';
import { getGalleryImages, saveImageToGallery, deleteImageFromGallery } from './services/galleryService';
import type { GalleryImage } from './types';
import GalleryModal from './components/GalleryModal';

const GalleryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null); // Raw data URL from API
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null); // Object URL for rendering
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

    // Effect to manage the object URL lifecycle for the original image
    useEffect(() => {
        if (!originalImage) {
            setOriginalImageUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(originalImage);
        setOriginalImageUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [originalImage]);
    
    // Effect to manage the object URL lifecycle for the generated image
    useEffect(() => {
        if (!generatedImageDataUrl) {
            setEditedImageUrl(null);
            return;
        }

        const dataURLtoBlob = (dataUrl: string): Blob | null => {
            const parts = dataUrl.split(',');
            if (parts.length < 2) return null;
            const mimeMatch = parts[0].match(/:(.*?);/);
            if (!mimeMatch) return null;
            const mime = mimeMatch[1];
            try {
                const byteString = atob(parts[1]);
                let n = byteString.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = byteString.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            } catch (e) {
                console.error("Failed to decode base64 string:", e);
                return null;
            }
        };

        const blob = dataURLtoBlob(generatedImageDataUrl);
        if (!blob) return;

        const objectUrl = URL.createObjectURL(blob);
        setEditedImageUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [generatedImageDataUrl]);

    // Load gallery images from IndexedDB on initial mount
    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await getGalleryImages();
                setGalleryImages(images);
            } catch (err: any) {
                console.error("Failed to load gallery images:", err);
                setError(`Could not load gallery. ${err.message || ''}`);
            }
        };
        loadImages();
    }, []);

    const handleImageUpload = useCallback((file: File) => {
        setOriginalImage(file);
        setGeneratedImageDataUrl(null); // Reset generated image on new upload
        setError(null);
    }, []);

    const processImage = useCallback(async (prompt: string) => {
        if (!originalImage) {
            setError("Please upload an image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImageDataUrl(null); // Clear previous image, triggering cleanup
        setIsImageLoaded(false);

        try {
            const resultUrl = await generateImage(originalImage, prompt);
            setGeneratedImageDataUrl(resultUrl);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [originalImage]);

    const handleSaveImage = useCallback(async () => {
        if (generatedImageDataUrl) {
            try {
                const updatedImages = await saveImageToGallery(generatedImageDataUrl);
                setGalleryImages(updatedImages);
            } catch (err) {
                 console.error("Failed to save image to gallery:", err);
                 setError("Could not save image to the gallery.");
            }
        }
    }, [generatedImageDataUrl]);

    const handleDeleteImage = useCallback(async (id: number) => {
        try {
            const updatedImages = await deleteImageFromGallery(id);
            setGalleryImages(updatedImages);
        } catch (err) {
            console.error("Failed to delete image from gallery:", err);
            setError("Could not delete image from the gallery.");
        }
    }, []);
    
    const handleSelectGalleryImage = useCallback((imageUrl: string) => {
        // We no longer close the gallery here. The zoom modal will open on top.
        setZoomedImageUrl(imageUrl); // Open in zoom modal
    }, []);
    
    const isCurrentGeneratedImageSaved = generatedImageDataUrl ? galleryImages.some(img => img.dataUrl === generatedImageDataUrl) : false;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans">
            <div className="container mx-auto max-w-7xl">
                <header className="text-center mb-8 relative">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        AI Image Style Editor
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Transform your images with AI-powered art styles and text prompts.
                    </p>
                    <button 
                        onClick={() => setIsGalleryOpen(true)}
                        className="absolute top-0 right-0 flex items-center gap-2 p-2 px-4 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-purple-500 transition-colors"
                        aria-label="Open my gallery"
                        title="Open My Gallery"
                    >
                        <GalleryIcon />
                        <span className="hidden sm:inline">Gallery</span>
                    </button>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Controls */}
                    <div className="flex flex-col gap-8 p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-purple-300">1. Upload Image</h2>
                            <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
                        </div>
                        {originalImage && (
                            <>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-purple-300">2. Quick Transform</h2>
                                    <GenderbendSelector onTransform={processImage} disabled={isLoading} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-purple-300">3. Apply a Style</h2>
                                    <StyleSelector onStyleSelect={processImage} disabled={isLoading} />
                                </div>
                                <div className="border-t border-gray-700 my-2"></div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-purple-300">4. Or Edit Manually</h2>
                                    <PromptEditor onSubmit={processImage} disabled={isLoading} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Image Display */}
                    <div className="flex flex-col gap-4 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 min-h-[500px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                             {/* Original Image */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-2 text-gray-400">Original</h3>
                                <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                                {originalImageUrl ? (
                                    <button
                                        onClick={() => setZoomedImageUrl(originalImageUrl)}
                                        className="w-full h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 rounded-lg"
                                        aria-label="Zoom in on original image"
                                    >
                                        <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain cursor-zoom-in" />
                                    </button>
                                ) : (
                                    <p className="text-gray-500">Upload an image to begin</p>
                                )}
                                </div>
                            </div>
                            {/* Edited Image */}
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-2 text-gray-400">Generated</h3>
                                <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative group">
                                {isLoading ? (
                                    <Loader />
                                ) : editedImageUrl ? (
                                    <>
                                        <button
                                            onClick={() => setZoomedImageUrl(editedImageUrl)}
                                            className="w-full h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 rounded-lg"
                                            aria-label="Zoom in on generated image"
                                        >
                                            <img 
                                                src={editedImageUrl} 
                                                alt="Edited" 
                                                className={`w-full h-full object-contain transition-opacity duration-500 cursor-zoom-in ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                                onLoad={() => setIsImageLoaded(true)}
                                            />
                                        </button>
                                        <div className="absolute top-2 right-2 flex flex-col gap-2 transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                            <a
                                                href={editedImageUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-black/60 rounded-full text-white/90 hover:text-white hover:bg-black/80 outline-none focus:ring-2 focus:ring-purple-500"
                                                aria-label="Open image in a new tab"
                                                title="Open in new tab"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                    <polyline points="15 3 21 3 21 9"></polyline>
                                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                                </svg>
                                            </a>
                                            <a
                                                href={editedImageUrl}
                                                download={`generated-image-${Date.now()}.png`}
                                                className="p-2 bg-black/60 rounded-full text-white/90 hover:text-white hover:bg-black/80 outline-none focus:ring-2 focus:ring-purple-500"
                                                aria-label="Download image"
                                                title="Download Image"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DownloadIcon />
                                            </a>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSaveImage(); }}
                                                disabled={isCurrentGeneratedImageSaved}
                                                className="p-2 bg-black/60 rounded-full text-white/90 hover:text-white hover:bg-black/80 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-green-700/80 disabled:cursor-not-allowed"
                                                aria-label={isCurrentGeneratedImageSaved ? "Image saved to gallery" : "Save image to gallery"}
                                                title={isCurrentGeneratedImageSaved ? "Saved to Gallery" : "Save to Gallery"}
                                            >
                                                <SaveIcon />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Your styled image will appear here</p>
                                )}
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                                <p><strong>Error:</strong> {error}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {/* The order of these modals is important for z-index stacking. Zoom modal should be after gallery. */}
            {isGalleryOpen && (
                <GalleryModal 
                    images={galleryImages} 
                    onClose={() => setIsGalleryOpen(false)} 
                    onDelete={handleDeleteImage}
                    onSelect={handleSelectGalleryImage}
                />
            )}
            {zoomedImageUrl && <ImageZoomModal imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />}
        </div>
    );
};

export default App;
