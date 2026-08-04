"use client";

import React from "react";
import Image from "next/image";

interface ChihiliLoaderProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  message?: string;
}

const ChihiliLoader: React.FC<ChihiliLoaderProps> = ({
  fullScreen = true,
  size = "md",
  message,
}) => {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"
    : "flex items-center justify-center w-full h-full";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated Logo Container */}
        <div className="relative w-48 h-48">
          {/* Outer circular loader */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#DC2626"
              strokeWidth="3"
              strokeDasharray="283"
              strokeDashoffset="70"
              strokeLinecap="round"
              className="animate-dash"
            />
          </svg>

          {/* Inner circular loader */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin-reverse"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              strokeDasharray="220"
              strokeDashoffset="55"
              strokeLinecap="round"
              className="animate-dash-reverse"
            />
          </svg>

          {/* Logo with pulse and float animation */}
          <div className="absolute inset-0 flex items-center justify-center animate-float">
            <div className={`${sizeClasses[size]} relative animate-pulse-soft`}>
              <Image
                src="/chihiliLogo.png"
                alt="Chihili"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-28 h-28 bg-red-500/20 rounded-full blur-2xl animate-pulse-glow" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce-1" />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce-2" />
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce-3" />
          </div>

          {message && (
            <p className="text-gray-700 font-medium text-sm animate-fade-in">
              {message}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 283;
          }
          50% {
            stroke-dashoffset: 70;
          }
          100% {
            stroke-dashoffset: 283;
          }
        }

        @keyframes dash-reverse {
          0% {
            stroke-dashoffset: 220;
          }
          50% {
            stroke-dashoffset: 55;
          }
          100% {
            stroke-dashoffset: 220;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-soft {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes bounce-1 {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-2 {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-3 {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }

        .animate-dash {
          animation: dash 1.5s ease-in-out infinite;
        }

        .animate-dash-reverse {
          animation: dash-reverse 1.5s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bounce-1 {
          animation: bounce-1 1.4s infinite;
        }

        .animate-bounce-2 {
          animation: bounce-2 1.4s infinite 0.2s;
        }

        .animate-bounce-3 {
          animation: bounce-3 1.4s infinite 0.4s;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  );
};

export default ChihiliLoader;
