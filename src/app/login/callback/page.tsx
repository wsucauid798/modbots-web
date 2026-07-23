"use client";

import { useEffect, useState } from "react";
import { loginCallbackMessage } from "../../../data/oauth";

// Where the account site returns after sign-in. The desktop app catches this
// redirect on a loopback listener it owns; here the redirect lands on a real
// route, which reports the result back to the app window that opened it and
// then closes itself.
const LoginCallback = (): React.ReactElement => {
  const [manualCode, setManualCode] = useState<string | null>(null);

  useEffect(() => {
    const search = window.location.search;

    if (window.opener !== null && window.opener !== window) {
      window.opener.postMessage(
        { type: loginCallbackMessage, search },
        window.location.origin,
      );
      window.close();
      return;
    }

    // Opened without an app window behind it, which happens when the person
    // carried the authorize URL to another browser. Show the code so it can be
    // pasted into the app's manual path.
    const params = new URLSearchParams(search);
    setManualCode(
      params.get("code") ??
        params.get("error_description") ??
        params.get("error") ??
        "no code was returned",
    );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        {manualCode === null ? (
          <p className="text-sm text-zinc-400">Completing sign-in...</p>
        ) : (
          <>
            <p className="text-sm text-zinc-400">
              Paste this code into Mod Bots to finish signing in.
            </p>
            <p className="mt-3 break-all font-mono text-base text-zinc-100">
              {manualCode}
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default LoginCallback;
