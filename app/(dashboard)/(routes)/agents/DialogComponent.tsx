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
    fetch('/api/updatePage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textareaValue }),
    })
      .then(() => {
        onSubmit(textareaValue);
        setTextareaValue('');
        onOpenChange(false);
      })
      .catch((error) => console.error('Error updating file:', error));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Text</DialogTitle>
        </DialogHeader>
        <Textarea value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} />
        {/* <Button className="mt-4" onClick={handleSubmit}> */}
        <Button className="mt-4">
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;