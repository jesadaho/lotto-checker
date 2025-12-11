'use client';

import { PrimeReactProvider as PRProvider } from 'primereact/api';

export default function PrimeReactProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PRProvider>
      {children}
    </PRProvider>
  );
}

