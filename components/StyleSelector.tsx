import React, { useState } from 'react';
import type { ArtStyle } from '../types';
import { ART_STYLES } from '../constants';
import InfoModal from './InfoModal';

interface StyleSelectorProps {
  onStyleSelect: (prompt: string) => void;
  disabled: boolean;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const StyleSelector: React.FC<StyleSelectorProps> = ({ onStyleSelect, disabled }) => {
  const [infoModalStyle, setInfoModalStyle] = useState<ArtStyle | null>(null);

  const handleInfoClick = (e: React.MouseEvent, style: ArtStyle) => {
    e.stopPropagation(); // Prevent the style from being selected
    setInfoModalStyle(style);
  };

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {ART_STYLES.map((style: ArtStyle) => (
            <div key={style.id} className="group relative rounded-lg overflow-hidden aspect-square">
                <button
                    onClick={() => onStyleSelect(style.prompt)}
                    disabled={disabled}
                    className="w-full h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    aria-label={`Apply ${style.name} style`}
                >
                    <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-colors duration-300 flex items-center justify-center p-2">
                        <span className="text-white font-bold text-center text-sm">{style.name}</span>
                    </div>
                </button>
                <button 
                    onClick={(e) => handleInfoClick(e, style)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white/80 hover:text-white hover:bg-black/75 transition-colors"
                    aria-label={`More info about ${style.name}`}
                    title={`More info about ${style.name}`}
                >
                    <InfoIcon />
                </button>
            </div>
          ))}
        </div>
      </div>
      {infoModalStyle && (
        <InfoModal style={infoModalStyle} onClose={() => setInfoModalStyle(null)} />
      )}
    </>
  );
};

export default React.memo(StyleSelector);