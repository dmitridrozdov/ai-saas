
import { cn } from "@/lib/utils"; // Adjust import path as needed

interface ResultDisplayProps {
  title: string;
  content: string;
  kanit: any; // Font class
  montserrat: any; // Font class
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
    <>
      <p className={cn("text-sm text-blue-500", kanit.className)}>
        {title}
      </p>
      <div className="flex flex-col gap-y-4">
        <div 
          key={content} 
          className={cn(
            "p-8 w-full flex items-start gap-x-8 rounded-sm", 
            "bg-violet-50 border border-black/10 shadow-sm", 
            montserrat.className
          )}
        >
          <p className="text-sm">
            {content}
          </p>
          <span style={{ marginLeft: 'auto' }}>
            <CopyIcon result={content} />
          </span>
        </div>
      </div>
    </>
  );
};
export default ResultDisplay;