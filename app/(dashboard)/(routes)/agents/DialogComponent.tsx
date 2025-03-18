'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

interface DialogComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (text: string) => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({ open, onOpenChange, onSubmit }) => {
  const [textareaValue, setTextareaValue] = useState('');

  const handleSubmit = () => {
    onSubmit(textareaValue);
    setTextareaValue(''); // Clear textarea after submission
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Text</DialogTitle>
        </DialogHeader>
        <Textarea value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} />
        <Button className="mt-4" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;