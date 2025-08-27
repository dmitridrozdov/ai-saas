import { Code, ImageIcon, MessageSquare, CheckCircle } from "lucide-react";

export const MAX_FREE_COUNTS = 10;

export const tools = [
  {
    label: 'Grammar Genie',
    icon: CheckCircle,
    href: '/grammar',
    color: "text-slate-400",
    bgColor: "bg-white",
  },
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-slate-400",
    bgColor: "bg-white",
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-slate-400",
    href: '/code',
    bgColor: "bg-white",
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-slate-400",
    href: '/image',
    bgColor: "bg-white",
  },

];

  export const grammarPrompt = `You are a professional writing assistant.
      I will provide you with a sentence, and you will perform the following actions:

      1. Analyze the original sentence and explain what is grammatically or stylistically incorrect about it.
      2. Correct the original sentence for grammar and spelling.
      3. Improve the corrected sentence to be more clear and impactful.
      4. Shorten the corrected sentence while maintaining its core meaning.
      5. Rephrase the sentence in two different tones:
          - A friendly and casual tone.
          - A formal and professional tone.

      Present the analysis using the following markdown structure, and all other results in XML format:

      ### Analysis
      [Your analysis of what is wrong with the original sentence]

      ---

      <corrected_sentence>[Corrected sentence here]</corrected_sentence>

      <improved_sentence>[Improved sentence here]</improved_sentence>

      <shortened_sentence>[Shortened sentence here]</shortened_sentence>

      <rephrased_versions>
          <friendly_tone>[Friendly version here]</friendly_tone>
          <formal_tone>[Formal version here]</formal_tone>
      </rephrased_versions>

      The sentence to process is: `