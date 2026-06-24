import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-dawn px-6">
      <div className="max-w-sm text-center">
        <p className="font-display text-7xl text-rose">404</p>
        <h2 className="mt-3 font-display text-2xl">This path doesn't bloom here</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-rose px-6 py-2.5 text-sm font-medium text-rose-foreground shadow-bloom transition hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-dawn px-6">
      <div className="max-w-sm text-center">
        <h1 className="font-display text-2xl">A pause in the journey</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something didn't load quite right. Take a breath, then try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-rose px-5 py-2 text-sm font-medium text-rose-foreground shadow-bloom"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#d4a5a5" },
      { title: "The Virtuous Wife App™ — Daily Biblical Growth for Women" },
      { name: "description", content: "A guided daily journey for biblical growth, marriage, and purpose — built on the V.I.R.T.U.E. Framework." },
      { name: "author", content: "The Virtuous Wife" },
      { property: "og:title", content: "The Virtuous Wife App™ — Daily Biblical Growth for Women" },
      { property: "og:description", content: "A guided daily journey for biblical growth, marriage, and purpose — built on the V.I.R.T.U.E. Framework." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "The Virtuous Wife App™ — Daily Biblical Growth for Women" },
      { name: "twitter:description", content: "A guided daily journey for biblical growth, marriage, and purpose — built on the V.I.R.T.U.E. Framework." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c8599adf-dbe6-4f78-8263-f76f7ff9e5bc/id-preview-c215d7cf--c04f6d68-c36b-4e23-b11b-6119bf2fd379.lovable.app-1782302675865.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c8599adf-dbe6-4f78-8263-f76f7ff9e5bc/id-preview-c215d7cf--c04f6d68-c36b-4e23-b11b-6119bf2fd379.lovable.app-1782302675865.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "icon", href: "/icon-512.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
