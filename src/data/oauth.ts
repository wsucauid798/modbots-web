import type { Actor } from "./contracts";
import { exchangeAccountToken, fetchRequest } from "./platform";

// The sign-in hand-off. Login happens at the account site (sign in or
// register there); the app only sends you there and takes you back once you
// are signed in. The automatic path opens the account site in a second window
// and catches the redirect when it lands back on this app's callback route;
// the manual path exists for when that return cannot come home (the window
// blocked by the browser, or the account site opened on another machine).
const accountBaseUrl =
  process.env.NEXT_PUBLIC_MODBOTS_ACCOUNT_URL ?? "http://localhost:3003";
const clientId = "modbots-web";

// The account service registers this app's redirect as WEB_REDIRECT_URI,
// defaulting to http://localhost:3000/login/callback. Derived from the live
// origin so it follows the app wherever it is served, and read lazily because
// there is no window during prerender.
export const loginCallbackPath = "/login/callback";

const currentRedirectUri = (): string =>
  new URL(loginCallbackPath, window.location.origin).toString();

const base64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const randomValue = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
};

const challengeFor = async (verifier: string): Promise<string> =>
  base64Url(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verifier),
      ),
    ),
  );

export interface BrowserLoginOutcome {
  actor: Actor;
  session: { token: string; expiresAt: string };
}

export interface BrowserLoginSession {
  // The exact authorization URL, shown to the user for transparency and to
  // copy into another browser if they prefer.
  authorizeUrl: string;
  // Resolves once the loopback listener catches the redirect and the token
  // is exchanged for a platform session.
  automatic: Promise<BrowserLoginOutcome>;
  // Completes the sign-in from a code the user pasted, for when the
  // automatic return could not happen.
  completeWithCode: (code: string) => Promise<BrowserLoginOutcome>;
}

const recoveryCodePrefix = "MBR-";

const exchangeCode = async (
  code: string,
  verifier: string,
): Promise<BrowserLoginOutcome> => {
  const tokenResponse = await fetchRequest(
    new URL("/oidc/token", accountBaseUrl).toString(),
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code,
        redirect_uri: currentRedirectUri(),
        code_verifier: verifier,
      }).toString(),
    },
  );

  if (!tokenResponse.ok) {
    throw new Error("The log-in could not be completed. Please try again.");
  }

  const tokens = (await tokenResponse.json()) as { access_token?: string };

  if (typeof tokens.access_token !== "string") {
    throw new Error("The account service returned no usable token.");
  }

  return exchangeAccountToken(tokens.access_token);
};

const exchangeRecoveryCode = async (
  code: string,
): Promise<BrowserLoginOutcome> => {
  const response = await fetchRequest(
    new URL("/login/recovery/redeem", accountBaseUrl).toString(),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    },
  );

  if (!response.ok) {
    throw new Error("The recovery code was not accepted. Please try again.");
  }

  const payload = (await response.json()) as { accessToken?: string };

  if (typeof payload.accessToken !== "string") {
    throw new Error("The account service returned no usable recovery token.");
  }

  return exchangeAccountToken(payload.accessToken);
};

// Prepares the login: builds the authorization URL and arms the loopback
// listener immediately, so the URL works whether the person clicks
// Continue in browser or copies it into any browser themselves.
const prepareBrowserLogin = async (): Promise<BrowserLoginSession> => {
  const verifier = randomValue();
  const state = randomValue();
  const challenge = await challengeFor(verifier);

  const authorize = new URL("/oidc/auth", accountBaseUrl);
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", currentRedirectUri());
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "openid profile");
  authorize.searchParams.set("code_challenge", challenge);
  authorize.searchParams.set("code_challenge_method", "S256");
  authorize.searchParams.set("state", state);
  const authorizeUrl = authorize.toString();

  const automatic = (async (): Promise<BrowserLoginOutcome> => {
    const params = await awaitCallbackParams();

    if (params.get("state") !== state) {
      throw new Error("The log-in response did not match this app's request.");
    }

    const code = params.get("code");

    if (code === null) {
      throw new Error(
        params.get("error_description") ??
          params.get("error") ??
          "The log-in did not complete.",
      );
    }

    return exchangeCode(code, verifier);
  })();

  return {
    authorizeUrl,
    automatic,
    completeWithCode: (code: string) => {
      const normalized = code.trim();

      return normalized.toUpperCase().startsWith(recoveryCodePrefix)
        ? exchangeRecoveryCode(normalized)
        : exchangeCode(normalized, verifier);
    },
  };
};

// The desktop app hands off to the system browser and waits on a loopback
// listener. Already being in a browser, this app opens the account site in a
// second window and waits for that window to report the redirect back. The
// callback route is what does the reporting.
export const loginCallbackMessage = "modbots:login-callback";

let callbackWindow: Window | null = null;
let releaseCallbackWait: (() => void) | null = null;

const awaitCallbackParams = (): Promise<URLSearchParams> =>
  new Promise<URLSearchParams>((resolve, reject) => {
    const receive = (event: MessageEvent): void => {
      if (
        event.origin !== window.location.origin ||
        typeof event.data !== "object" ||
        event.data === null ||
        (event.data as { type?: unknown }).type !== loginCallbackMessage
      ) {
        return;
      }

      release();
      resolve(
        new URLSearchParams((event.data as { search?: string }).search ?? ""),
      );
    };

    const release = (): void => {
      window.removeEventListener("message", receive);
      releaseCallbackWait = null;
    };

    releaseCallbackWait = (): void => {
      release();
      reject(new Error("The log-in was canceled."));
    };

    window.addEventListener("message", receive);
  });

export const openInBrowser = async (url: string): Promise<void> => {
  callbackWindow = window.open(url, "modbots-login", "popup,width=520,height=720");

  if (callbackWindow === null) {
    // The window was blocked. The manual code path stays available, and the
    // authorize URL is already on screen for the person to open themselves.
    throw new Error(
      "The browser blocked the log-in window. Open the address shown, or paste the code you are given.",
    );
  }
};

export const resetBrowserLoginSession = async (): Promise<void> => {
  try {
    releaseCallbackWait?.();
    callbackWindow?.close();
    callbackWindow = null;
  } finally {
    liveSession = null;
  }
};

// One live login session at a time: the loopback listener accepts a single
// request, so the session (URL, verifier, state, listener) is shared until
// its automatic return settles or is explicitly canceled, then the next
// request starts fresh.
let liveSession: Promise<BrowserLoginSession> | null = null;

export const getBrowserLoginSession = (): Promise<BrowserLoginSession> => {
  if (liveSession === null) {
    liveSession = prepareBrowserLogin().then((session) => {
      void session.automatic.finally(() => {
        liveSession = null;
      });
      return session;
    });
  }

  return liveSession;
};
