import React, { useEffect } from 'react';
import type { ArtStyle } from '../types';

interface InfoModalProps {
  style: ArtStyle;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const InfoModal: React.FC<InfoModalProps> = ({ style, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
        >
            <div 
                className="bg-gray-800 text-gray-100 rounded-2xl shadow-xl w-full max-w-md m-4 p-6 border border-gray-700 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    aria-label="Close modal"
                >
                    <CloseIcon />
                </button>
                <h2 id="info-modal-title" className="text-2xl font-bold mb-4 text-purple-300">{style.name}</h2>
                <p className="text-gray-300 whitespace-pre-wrap">{style.description}</p>
            </div>
        </div>
    );
};

export default InfoModal;