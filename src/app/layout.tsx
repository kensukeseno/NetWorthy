'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import { Provider } from 'urql';
import { client } from '../../lib/urqlClient';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* Enable  graphql client*/}
          <Provider value={client}>{children}</Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
