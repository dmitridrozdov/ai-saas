// page.tsx (Modified Original Code)
'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import DialogComponent from './DialogComponent';

const page = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmitText = (text: string) => {
    console.log('Submitted Text:', text);
    // Handle submitted text here (e.g., send to API)
  };

  return (
    <div>
      <Button onClick={() => setDialogOpen(true)}>Original name</Button>
      <DialogComponent open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmitText} />
    </div>
  );
};

export default page;