
import React from 'react';

// Utility function for class names (replace with your actual implementation)
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface ResultDisplayProps {
  title: string;
  content: string;
  kanit: any;
  montserrat: any;
  CopyIcon: React.ComponentType<{ result: string }>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  title,
  content,
  kanit,
  montserrat,
  CopyIcon
}) => {
  return (
    <div className="group relative transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2">
      {/* Gradient background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-2xl opacity-0 blur-xl group-hover:opacity-75 transition-all duration-300"></div>
      
      {/* Main card */}
      <div className="relative bg-white rounded-2xl shadow-md group-hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-violet-300">
        {/* Header with gradient accent */}
        <div className="relative px-6 pt-6 pb-4 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-violet-50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 transition-all duration-300 group-hover:h-2"></div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full transition-all duration-300 group-hover:w-2 group-hover:h-8 group-hover:shadow-lg group-hover:shadow-violet-500/50"></div>
            <h3 className={cn(
              "text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent transition-all duration-300 group-hover:text-lg",
              kanit.className
            )}>
              {title}
            </h3>
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 pb-6">
          <div className="relative group/content">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-blue-50/50 rounded-xl"></div>
            
            <div className="relative p-6 rounded-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 group-hover:border-violet-400 group-hover:bg-white group-hover:shadow-lg group-hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                {/* Content text */}
                <p className={cn(
                  "text-sm leading-relaxed text-gray-700 flex-1",
                  montserrat.className
                )}>
                  {content}
                </p>

                {/* Copy button with modern styling */}
                <div className="flex-shrink-0 mt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(content);
                    }}
                    className="p-2 rounded-lg bg-white border border-gray-200 transition-all duration-200 group-hover:border-violet-400 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-purple-500 group-hover:shadow-lg hover:scale-110 cursor-pointer"
                  >
                    <CopyIcon result={content} />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            {/* <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-gradient-to-tl from-violet-100 to-transparent rounded-tl-3xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:w-24 group-hover:h-24 pointer-events-none"></div> */}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-violet-200 to-transparent transition-all duration-300 group-hover:h-1 group-hover:via-violet-500 group-hover:shadow-lg group-hover:shadow-violet-500/50"></div>
      </div>
    </div>
  );
};

export default ResultDisplay;