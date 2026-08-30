import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window === "undefined") {
      // During next build, client components can be pre-rendered without
      // runtime environment variables being available yet. Use placeholders
      // so the build does not fail; real visitors still get the real values
      // in the browser at runtime.
      return createBrowserClient(
        "https://placeholder.supabase.co",
        "placeholder-anon-key"
      );
    }

    throw new Error("Supabase URL/anon key are missing. Check your .env.local file.");
  }

  return createBrowserClient(url, key);
}
