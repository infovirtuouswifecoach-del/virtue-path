import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Map, Users, User, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const TABS: { to: string; label: string; Icon: LucideIcon }[] = [
  { to: "/today", label: "Today", Icon: Home },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/journey", label: "Journey", Icon: Map },
  { to: "/community", label: "Community", Icon: Users },
  { to: "/profile", label: "Profile", Icon: User },
];

export function MobileShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="app-shell pb-[calc(env(safe-area-inset-bottom)+5rem)]">
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[30rem] border-t border-border/70 bg-card/95 backdrop-blur-xl">
        <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {TABS.map(({ to, label, Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] uppercase tracking-wider transition ${
                    active ? "text-rose" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
