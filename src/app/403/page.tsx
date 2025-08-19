'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
export default function GlobalError() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <h2 className="text-center text-primary text-2xl md:text-7xl font-bold">Oop!! 403</h2>
      <p className="text-md text-center">
        {"You are not authorized to access this page."}
      </p>
      <Button
        onClick={
          () => window.location.href = "/"
        }
      >
        Go to Homepage
      </Button>
    </main>
  );
}