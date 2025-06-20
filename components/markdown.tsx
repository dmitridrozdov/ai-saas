import React from "react";
import markdownit from "markdown-it";
import DOMPurify from 'dompurify';

type Props = {
  text: string;
  className?: string; // Optional className prop
};

const md = markdownit({ });

const Markdown = ({ text, className }: Props) => {
  const htmlcontent = md.render(text);
  const sanitized = DOMPurify.sanitize(htmlcontent);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default Markdown;