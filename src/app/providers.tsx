"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

// The desktop app builds this client in main.tsx, where it mounts React. Next
// owns the mounting, so the client lives here instead and the root layout uses
// it. Created through useState so each browser session gets one client and it
// is never shared across requests on the server.
const Providers = ({ children }: { children: ReactNode }): React.ReactElement => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 2_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
