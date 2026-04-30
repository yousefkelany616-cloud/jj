import { Instagram } from "lucide-react";
import { useT } from "@/lib/i18n";
import xploriaLogo from "@assets/xploria-logo-transparent.png";

const INSTAGRAM_URL =
  "https://www.instagram.com/xploria21?igsh=MXRhOHh6NTd0cTFzZg%3D%3D&utm_source=qr";
const INSTAGRAM_HANDLE = "@xploria21";

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={xploriaLogo}
              alt="Xploria"
              className="h-10 w-auto object-contain dark:invert"
            />
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("footer.followUs")}
            </span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>{INSTAGRAM_HANDLE}</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {year} Xploria. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
