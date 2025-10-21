import React, { useState, useEffect, useRef } from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ZoomInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
);

const ZoomOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v6h6"></path>
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
        <path d="M21 22v-6h-6"></path>
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
    </svg>
);


interface ImageZoomModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const [baseScale, setBaseScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const setupImage = () => {
        if (!imageRef.current || !containerRef.current) return;
        
        const { naturalWidth, naturalHeight } = imageRef.current;
        const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();

        const scaleX = containerWidth / naturalWidth;
        const scaleY = containerHeight / naturalHeight;
        const initialScale = Math.min(scaleX, scaleY) * 0.9; // 90% of fit

        const initialX = (containerWidth - naturalWidth * initialScale) / 2;
        const initialY = (containerHeight - naturalHeight * initialScale) / 2;

        setScale(initialScale);
        setBaseScale(initialScale);
        setPosition({ x: initialX, y: initialY });
        setIsImageLoaded(true);
    };

    // Close on Escape key
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

    // Panning logic
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isPanning) return;
            event.preventDefault();
            setPosition({
                x: event.clientX - startPan.x,
                y: event.clientY - startPan.y,
            });
        };

        const handleMouseUp = () => {
            setIsPanning(false);
        };

        if (isPanning) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isPanning, startPan]);

    const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
        event.preventDefault();
        setIsPanning(true);
        setStartPan({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const zoomFactor = 1.2;
        const delta = event.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

        setScale(prevScale => {
            const newScale = Math.max(baseScale * 0.1, Math.min(prevScale * delta, baseScale * 10));
            setPosition(prevPosition => {
                const newX = mouseX - (mouseX - prevPosition.x) * (newScale / prevScale);
                const newY = mouseY - (mouseY - prevPosition.y) * (newScale / prevScale);
                return { x: newX, y: newY };
            });
            return newScale;
        });
    };
    
    const applyZoom = (zoomMultiplier: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setScale(prevScale => {
            const newScale = Math.max(baseScale * 0.1, Math.min(prevScale * zoomMultiplier, baseScale * 10));
             setPosition(prevPosition => {
                const newX = centerX - (centerX - prevPosition.x) * (newScale / prevScale);
                const newY = centerY - (centerY - prevPosition.y) * (newScale / prevScale);
                return { x: newX, y: newY };
            });
            return newScale;
        });
    };

    const handleZoomIn = () => applyZoom(1.25);
    const handleZoomOut = () => applyZoom(1 / 1.25);
    const handleReset = () => setupImage();

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image zoom view"
        >
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.2s ease-out;
                    }
                `}
            </style>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                aria-label="Close zoom view"
            >
                <CloseIcon />
            </button>
            
            <div
                ref={containerRef}
                className="w-full h-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
            >
                <img 
                    ref={imageRef}
                    src={imageUrl} 
                    alt="Zoomed view" 
                    onLoad={setupImage}
                    className="absolute rounded-lg shadow-2xl"
                    style={{
                        visibility: isImageLoaded ? 'visible' : 'hidden',
                        transformOrigin: '0 0',
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        cursor: isPanning ? 'grabbing' : 'grab',
                        transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                        willChange: 'transform',
                    }}
                    onMouseDown={handleMouseDown}
                    draggable="false"
                />
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-gray-900/70 rounded-full border border-gray-700/50 shadow-lg backdrop-blur-sm z-20">
                <button onClick={handleZoomOut} className="p-2 text-gray-300 hover:text-white transition-colors rounded-full" aria-label="Zoom out" title="Zoom Out">
                    <ZoomOutIcon />
                </button>
                <span className="text-white font-mono w-16 text-center tabular-nums">{Math.round((scale/baseScale) * 100)}%</span>
                <button onClick={handleZoomIn} className="p-2 text-gray-300 hover:text-white transition-colors rounded-full" aria-label="Zoom in" title="Zoom In">
                    <ZoomInIcon />
                </button>
                <div className="w-px h-6 bg-gray-600 mx-1"></div>
                <button onClick={handleReset} className="p-2 text-gray-300 hover:text-white transition-colors rounded-full" aria-label="Reset zoom" title="Reset Zoom">
                    <ResetIcon />
                </button>
            </div>
        </div>
    );
};

export default ImageZoomModal;