"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

const LOCALES = ["pt-BR", "en"] as const;

export function LocaleSwitcher() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    if (next === locale) return;
    // Replace current locale segment in path
    const segments = pathname.split("/");
    segments[1] = next;
    const newPath = segments.join("/");
    localStorage.setItem("locale", next);
    router.push(newPath);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{t("language_label")}</span>
      <div className="flex gap-2" role="radiogroup" aria-label={t("language_label")}>
        {LOCALES.map((loc) => (
          <button
            key={loc}
            role="radio"
            aria-checked={locale === loc}
            onClick={() => switchLocale(loc)}
            className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
              locale === loc
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted"
            }`}
          >
            {loc === "pt-BR" ? "PT-BR" : "EN"}
          </button>
        ))}
      </div>
    </div>
  );
}
