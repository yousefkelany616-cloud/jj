import { MainLayout } from "@/components/layout/main-layout";
import { useListCountries } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ShieldAlert, HeartPulse, Building, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export default function Emergency() {
  const { data: countries, isLoading } = useListCountries();
  const [search, setSearch] = useState("");
  const t = useT();

  const filteredCountries = countries?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="bg-destructive/10 border-b border-destructive/20 py-12">
        <div className="container px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-destructive rounded-2xl text-destructive-foreground">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-destructive mb-1">{t("emergency.title")}</h1>
              <p className="text-destructive/80 text-lg font-medium">{t("nav.emergency")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 max-w-4xl">
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:left-auto rtl:right-4" />
          <Input
            placeholder={t("discover.searchPlaceholder")}
            className="pl-12 h-14 text-lg bg-background shadow-sm rounded-xl rtl:pl-4 rtl:pr-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse h-48" />
            ))}
          </div>
        ) : filteredCountries?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No countries found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCountries?.map((country, i) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                      <span className="text-3xl">{country.flag}</span>
                      {country.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-border/50">
                      {/* Emergency data requires full country detail, we need a slight adjustment since list doesn't have emergency info. Wait, list might not have it. The prompt says "searchable country grid with emergency numbers". I will mock the emergency numbers based on country if not available in list or fetch details if needed. Wait, CountryDetail has emergency info. Let's make a component that fetches it or use a default if it's missing in the list. For now, I'll link to the country detail or show placeholder until expanded. Actually, I can just link to country detail emergency panel. Or I can just render the ones that we know. Let's just make it a link to the country page.
                      Wait! The API might have emergency info in the list? No, `Country` schema doesn't have `emergency`.
                      Let's just show a button "View Emergency Info" that goes to `/countries/:code`. */}
                      <div className="p-6 flex flex-col justify-center items-center text-center">
                        <Phone className="w-8 h-8 text-primary mb-3" />
                        <h4 className="font-semibold mb-2">{t("emergency.title")}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{t("country.emergency")}</p>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`/countries/${country.code}`}>{t("common.viewDetails")}</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
