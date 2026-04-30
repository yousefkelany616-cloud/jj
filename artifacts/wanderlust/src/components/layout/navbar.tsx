import { Link, useLocation } from "wouter";
import { useGetSession, useLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Compass, User as UserIcon, Menu, Map as MapIcon, LogOut, Sun, Moon, Languages } from "lucide-react";
import xploriaLogo from "@assets/xploria-logo-transparent.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import { getGetSessionQueryKey } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const { data: session } = useGetSession();
  const logoutParams = useLogout();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const { t, lang, setLang } = useI18n();

  const handleLogout = async () => {
    await logoutParams.mutateAsync();
    queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey() });
    setLocation("/");
  };

  const navLinks = [
    { href: "/discover", label: t("nav.discover"), icon: Compass },
    { href: "/countries", label: t("nav.destinations"), icon: MapIcon },
    { href: "/trip-tracker", label: t("nav.trackTrip"), icon: MapIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Xploria">
            <img
              src={xploriaLogo}
              alt="Xploria"
              className="h-12 w-auto object-contain transition-opacity group-hover:opacity-80 dark:invert"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="gap-1 px-2 font-semibold"
            aria-label={t("nav.toggleLanguage")}
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs">{lang === "en" ? "AR" : "EN"}</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t("nav.toggleTheme")}</span>
          </Button>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={session.user.avatarUrl || undefined} alt={session.user.name} />
                    <AvatarFallback>{session.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/dashboard")}>{t("nav.dashboard")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/trips")}>{t("nav.myTrips")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/favorites")}>{t("nav.favorites")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/profile")}>{t("nav.profile")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/emergency")}>{t("nav.emergency")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="default" size="sm" onClick={() => setLocation("/login")}>
                {t("nav.signIn")}
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("nav.toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
                {!session?.user && (
                  <Button className="mt-4 w-full" onClick={() => setLocation("/login")}>
                    {t("nav.signIn")}
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
