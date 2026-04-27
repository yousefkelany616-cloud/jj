import { MainLayout } from "@/components/layout/main-layout";
import { useListCountries } from "@workspace/api-client-react";
import { CountryCard, CountryCardSkeleton } from "@/components/ui/country-card";
import { useT } from "@/lib/i18n";

export default function Countries() {
  const { data: countries, isLoading } = useListCountries();
  const t = useT();

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container px-4">
          <h1 className="text-4xl font-serif font-bold mb-2">{t("countries.title")}</h1>
        </div>
      </div>

      <div className="container px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CountryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries?.map((country, i) => (
              <CountryCard key={country.code} country={country} index={i} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
