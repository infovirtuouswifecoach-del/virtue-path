import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "@tanstack/react-router";
import heroImage from "@/assets/hero-bloom.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/today", replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  if (checking) {
    return <div className="flex min-h-dvh items-center justify-center bg-dawn" />;
  }

  return (
    <div className="app-shell bg-dawn">
      <div className="relative">
        <img
          src={heroImage}
          alt="Sunrise behind an olive branch"
          width={1280}
          height={896}
          className="aspect-[5/4] w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="-mt-10 px-7 pb-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">The Virtuous Wife App™</p>
        <h1 className="mt-3 font-display text-[2.6rem] leading-[1.05]">
          Become the woman <em className="text-rose">God</em> called you to be.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          A guided daily journey of biblical growth, marriage, and purpose — built on the V.I.R.T.U.E. Framework.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="block rounded-full bg-rose-gradient py-3.5 text-center text-[15px] font-medium text-rose-foreground shadow-bloom transition active:scale-[0.99]"
          >
            Begin your journey
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signin" }}
            className="block rounded-full border border-border bg-card py-3.5 text-center text-[15px] font-medium text-foreground transition active:scale-[0.99]"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-2 text-center">
          {[
            { k: "V", label: "Vision" },
            { k: "I", label: "Intimacy" },
            { k: "R", label: "Release" },
            { k: "T", label: "Truth" },
            { k: "U", label: "Uplift" },
            { k: "E", label: "Equipped" },
          ].map((p) => (
            <div key={p.k} className="rounded-2xl border border-border/70 bg-card/60 px-2 py-3 shadow-soft">
              <div className="font-display text-2xl text-rose">{p.k}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
