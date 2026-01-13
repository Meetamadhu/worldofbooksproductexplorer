'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        shouldRetryOnError: true,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}