import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
    'Summoning digital artists...',
    'Teaching AI about art history...',
    'Mixing the perfect color palette...',
    'Applying stylistic brushstrokes...',
    'Adding the finishing touches...',
];

const Loader: React.FC = () => {
    const [message, setMessage] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(currentMessage => {
                const currentIndex = LOADING_MESSAGES.indexOf(currentMessage);
                const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
                return LOADING_MESSAGES[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="flex flex-col justify-center items-center w-full h-full text-center p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-4 text-gray-400 text-lg animate-pulse">{message}</p>
        </div>
    );
};

export default React.memo(Loader);
