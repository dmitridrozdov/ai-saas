import React from 'react';

interface CustomMarkdownProps {
  content: string;
  font?: string;
  fontSize?: string;
  className?: string;
}

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ 
  content, 
  font = 'Arial, sans-serif',
  fontSize = '16px',
  className = ''
}) => {
  // Simple markdown parser for basic elements
  const parseMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Code inline
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  const parsedContent = parseMarkdown(content);

  const containerStyle: React.CSSProperties = {
    fontFamily: font,
    fontSize: fontSize,
    lineHeight: '1.6',
    color: '#333',
  };

  return (
    <div 
      className={className}
      style={containerStyle}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
};

export default CustomMarkdown;

// Example usage component
// const MarkdownExample: React.FC = () => {
//   const sampleMarkdown = `# Custom Markdown with Font

// This is a **bold text** and this is *italic text*.

// ## Subheading

// Here's some \`inline code\` and a [link](https://example.com).

// ### Features:
// - Custom font family
// - Configurable font size
// - Basic markdown parsing
// - TypeScript support`;

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px' }}>
//       <h2>Markdown with Different Fonts</h2>
      
//       <div style={{ marginBottom: '30px' }}>
//         <h3>Georgia Font</h3>
//         <CustomMarkdown 
//           content={sampleMarkdown}
//           font="Georgia, serif"
//           fontSize="18px"
//         />
//       </div>

//       <div style={{ marginBottom: '30px' }}>
//         <h3>Courier Font</h3>
//         <CustomMarkdown 
//           content={sampleMarkdown}
//           font="'Courier New', monospace"
//           fontSize="16px"
//         />
//       </div>

//       <div style={{ marginBottom: '30px' }}>
//         <h3>System Font</h3>
//         <CustomMarkdown 
//           content={sampleMarkdown}
//           font="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui"
//           fontSize="17px"
//         />
//       </div>
//     </div>
//   );
// };

// export default MarkdownExample;