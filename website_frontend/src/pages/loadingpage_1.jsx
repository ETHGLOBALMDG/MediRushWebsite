import React from 'react';

const LoadingPageStyles = () => (
    <style>
        {`
            .loading-page-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #f8f9fa; /* A light grey, clean background */
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .loader-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px; 
            }

            .caduceus-animation-container {
                width: 200px;
                height: 200px;
            }
            
            .caduceus-animation-container svg {
                width: 100%;
                height: 100%;
                overflow: visible;
            }

            /* Animation Keyframes */
            @keyframes draw-in {
                to {
                    stroke-dashoffset: 0;
                }
            }

            @keyframes fade-in {
                to {
                    opacity: 1;
                }
            }

            @keyframes slow-pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.03);
                }
            }

            @keyframes fade-in-text {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Applying animations */
            .caduceus-symbol {
                transform-origin: center;
                animation: slow-pulse 8s ease-in-out infinite;
                animation-delay: 3s; /* Start pulsing after the draw-in animation */
            }

            .snake-path {
                stroke-dasharray: 500; /* Approximate length of the path */
                stroke-dashoffset: 500;
                animation: draw-in 3s ease-out forwards;
            }
            
            .snake-path.right {
                animation-delay: 0.2s;
            }

            .wings {
                opacity: 0;
                transform-origin: 50% 90%;
                animation: fade-in 1s ease-in forwards;
                animation-delay: 2.5s;
            }
            
            .staff {
                 opacity: 0;
                 animation: fade-in 1s ease-in forwards;
                 animation-delay: 0.5s;
            }

            .text-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }

            .loading-text {
                font-family: 'Inter', sans-serif;
                font-size: 2rem;
                font-weight: 600;
                color: #10b981; /* Thematic Green */
                opacity: 0;
                animation: fade-in-text 1.5s ease-in-out forwards;
                animation-delay: 1s;
            }
            
            .tagline-text {
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
                font-weight: 400;
                color: #6c757d; /* A subtle grey */
                letter-spacing: 0.5px;
                opacity: 0;
                animation: fade-in-text 1.5s ease-in-out forwards;
                animation-delay: 1.5s; /* Fade in after the main title */
            }
        `}
    </style>
);


const LoadingPage = ({ tagline}) => {
    return (
        <>
            <LoadingPageStyles />
            <div className="loading-page-container">
                <div className="loader-content">
                    <div className="caduceus-animation-container">
                        <svg viewBox="0 0 100 100">
                            <g className="caduceus-symbol" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line className="staff" x1="50" y1="15" x2="50" y2="85" />
                                <circle className="staff" cx="50" cy="10" r="5" fill="#10b981"/>
                                <g className="wings" fill="#10b981" stroke="none">
                                    <path d="M 50 15 Q 35 20, 30 10 C 25 20, 35 30, 50 25" />
                                    <path d="M 50 15 Q 65 20, 70 10 C 75 20, 65 30, 50 25" />
                                </g>
                                <path className="snake-path left" d="M 38,85 C 25,75 25,55 38,45 L 62,25 C 75,15 75,-5 62,-15" transform="translate(0, 10)" />
                                <path className="snake-path right" d="M 62,85 C 75,75 75,55 62,45 L 38,25 C 25,15 25,-5 38,-15" transform="translate(0, 10)"/>
                            </g>
                        </svg>
                    </div>
                    <div className="text-container">
                        <div className="loading-text">MediRush</div>
                        <div className="tagline-text">{tagline}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoadingPage;
