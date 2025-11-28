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
    <div className="group relative">
      {/* Gradient background effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition duration-500"></div>
      
      {/* Main card */}
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Header with gradient accent */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500"></div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></div>
            <h3 className={cn(
              "text-base font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent",
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
            
            <div className="relative p-6 rounded-xl border border-gray-200/50 backdrop-blur-sm hover:border-violet-200 transition-colors duration-300">
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
                  <div className="p-2 rounded-lg bg-white border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 hover:shadow-md group/icon">
                    <CopyIcon result={content} />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-gradient-to-tl from-violet-100 to-transparent rounded-tl-3xl opacity-0 group-hover/content:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>
      </div>
    </div>
  );
};

export default ResultDisplay; 