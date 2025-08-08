'use client'; // ถ้าใช้ react-query ใน layout client component ต้องมี

import { QueryClient, QueryClientProvider  as QueryTanstackProvider} from '@tanstack/react-query';
import React, { useState } from 'react';

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
     <QueryTanstackProvider client={queryClient}>
          {children}
     </QueryTanstackProvider>
  );
}
