import React, { useEffect } from 'react';
import type { GalleryImage } from '../types';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
);

interface GalleryModalProps {
  images: GalleryImage[];
  onClose: () => void;
  onDelete: (id: number) => void;
  onSelect: (imageUrl: string) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ images, onClose, onDelete, onSelect }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
        >
             <style>{`.animate-fade-in { animation: fade-in 0.2s ease-out; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
            <div 
                className="bg-gray-800 text-gray-100 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] m-4 flex flex-col border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 id="gallery-modal-title" className="text-2xl font-bold text-purple-300">My Gallery</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto">
                    {images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <p className="text-xl">Your gallery is empty.</p>
                            <p>Saved images will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map(image => (
                                <div key={image.id} className="group relative rounded-lg overflow-hidden aspect-square">
                                    <button onClick={() => onSelect(image.dataUrl)} className="w-full h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 rounded-lg">
                                      <img src={image.dataUrl} alt={`Generated image ${image.id}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    </button>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors duration-300"></div>
                                    <button 
                                        onClick={() => onDelete(image.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-800/60 rounded-full text-white/90 hover:text-white hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100"
                                        aria-label="Delete image"
                                        title="Delete image"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;