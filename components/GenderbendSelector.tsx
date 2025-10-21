import React from 'react';

const MaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="17" y1="7" x2="22" y2="2"/>
        <polyline points="17 2 22 2 22 7"/>
    </svg>
);

const FemaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <circle cx="12" cy="9" r="5"/>
        <line x1="12" y1="14" x2="12" y2="22"/>
        <line x1="9" y1="19" x2="15" y2="19"/>
    </svg>
);


interface GenderbendSelectorProps {
  onTransform: (prompt: string) => void;
  disabled: boolean;
}

const GENDERBEND_PROMPTS = {
    male: "Perform a gender-swap transformation on the character(s) in the image, changing them to male. This is a complete re-rendering task, not a simple filter. It is CRITICAL to perfectly preserve the original art style, including line work, coloring, shading, and overall aesthetic. The character's pose, clothing (adapted for the new gender), and key thematic elements must also be retained. The final image should look like it was drawn by the original artist, but depicting a male version of the character.",
    female: "Perform a gender-swap transformation on the character(s) in the image, changing them to female. This is a complete re-rendering task, not a simple filter. It is CRITICAL to perfectly preserve the original art style, including line work, coloring, shading, and overall aesthetic. The character's pose, clothing (adapted for the new gender), and key thematic elements must also be retained. The final image should look like it was drawn by the original artist, but depicting a female version of the character."
};


const GenderbendSelector: React.FC<GenderbendSelectorProps> = ({ onTransform, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => onTransform(GENDERBEND_PROMPTS.male)}
        disabled={disabled}
        className="w-full flex items-center justify-center p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        aria-label="Transform character to male"
      >
        <MaleIcon />
        Transform to Male
      </button>
      <button
        onClick={() => onTransform(GENDERBEND_PROMPTS.female)}
        disabled={disabled}
        className="w-full flex items-center justify-center p-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        aria-label="Transform character to female"
      >
        <FemaleIcon />
        Transform to Female
      </button>
    </div>
  );
};

export default React.memo(GenderbendSelector);