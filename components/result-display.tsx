import React from 'react';

// Utility function for class names (replace with your actual implementation)
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface ResultDisplayProps {
  title: string;
  content: string;
  headerFont: any;
  contentFont: any;
}


const ResultDisplay: React.FC<ResultDisplayProps> = ({
  title,
  content,
  headerFont,
  contentFont,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      onClick={handleCopy}
      className="group relative transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer"
    >
      {/* Gradient background effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-2xl opacity-0 blur-xl group-hover:opacity-75 transition-all duration-300"></div>
      
      {/* Success animation overlay */}
      {copied && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-0 animate-[ping_0.6s_ease-out] pointer-events-none z-10"></div>
      )}
      
      {/* Main card */}
      <div className="relative bg-white rounded-2xl shadow-md group-hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-violet-300">
        {/* Header with gradient accent */}
        <div className="relative px-6 pt-6 pb-4 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-violet-50">
          <div className={cn(
            "absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-all duration-300 group-hover:h-2",
            copied 
              ? "from-green-400 via-emerald-500 to-green-400" 
              : "from-blue-500 via-violet-500 to-purple-500"
          )}></div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-1.5 h-6 bg-gradient-to-b rounded-full transition-all duration-300 group-hover:w-2 group-hover:h-8 group-hover:shadow-lg",
              copied
                ? "from-green-500 to-emerald-500 group-hover:shadow-green-500/50"
                : "from-blue-500 to-violet-500 group-hover:shadow-violet-500/50"
            )}></div>
            <h3 className={cn(
              "text-base font-semibold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 group-hover:text-lg",
              copied 
                ? "from-green-600 to-emerald-600" 
                : "from-blue-600 to-violet-600",
              headerFont.className
            )}>
              {copied ? "✓ Copied!" : title}
            </h3>
          </div>
        </div>

        {/* Content area */}
        <div className="px-6 pb-6">
          <div className="relative group/content">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-blue-50/50 rounded-xl"></div>
            
            <div className="relative p-6 rounded-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 group-hover:border-violet-400 group-hover:bg-white group-hover:shadow-lg group-hover:scale-[1.02]">
              {/* Content text */}
              <p className={cn(
                "text-sm leading-relaxed text-gray-700",
                contentFont.className
              )}>
                {content}
              </p>
            </div>
         </div>
        </div>

        {/* Bottom accent line */}
        <div className={cn(
          "h-0.5 bg-gradient-to-r transition-all duration-300 group-hover:h-1 group-hover:shadow-lg",
          copied
            ? "from-transparent via-green-500 to-transparent group-hover:shadow-green-500/50"
            : "from-transparent via-violet-200 to-transparent group-hover:via-violet-500 group-hover:shadow-violet-500/50"
        )}></div>
      </div>
    </div>
  );
};

export default ResultDisplay;