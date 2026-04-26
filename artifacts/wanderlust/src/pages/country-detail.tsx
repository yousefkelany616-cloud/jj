import { MainLayout } from "@/components/layout/main-layout";
import { useGetCountry, getGetCountryQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { ActivityCard } from "@/components/ui/activity-card";
import { MapPin, Phone, ShieldAlert, HeartPulse, Building, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CountryDetail() {
  const { code } = useParams<{ code: string }>();
  const { data: country, isLoading } = useGetCountry(code, {
    query: { enabled: !!code, queryKey: getGetCountryQueryKey(code) },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse">
          <div className="h-[50vh] bg-muted w-full" />
          <div className="container px-4 py-12 space-y-8">
            <div className="h-10 bg-muted w-1/3 rounded" />
            <div className="h-32 bg-muted w-full rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-muted w-full rounded" />
              <div className="h-64 bg-muted w-full rounded md:col-span-2" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!country) {
    return (
      <MainLayout>
        <div className="container px-4 py-20 text-center">
          <h2 className="text-2xl font-serif font-bold">Country not found</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative h-[50vh] min-h-[400px] flex items-end pb-12">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={country.heroImage}
          alt={country.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-20 px-4 text-white">
          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground mb-4">
            {country.region}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 flex items-center gap-4">
            {country.name} <span>{country.flag}</span>
          </h1>
          <div className="flex gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              <span>Best Season: {country.bestSeason}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Currency: {country.currency}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-bold mb-6">About</h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">
                  {country.description}
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-serif font-bold">Adventures in {country.name}</h2>
                <Badge variant="outline">{country.activities.length} available</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {country.activities.map((activity, i) => (
                  <ActivityCard key={activity.id} activity={activity} index={i} />
                ))}
              </div>
            </section>
          </div>

          <div>
            <Card className="sticky top-24 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="w-5 h-5" />
                  Emergency Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md"><Phone className="w-4 h-4" /></div>
                    <span className="font-medium">Police</span>
                  </div>
                  <a href={`tel:${country.emergency.police}`} className="text-primary font-bold hover:underline">
                    {country.emergency.police}
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md"><HeartPulse className="w-4 h-4 text-destructive" /></div>
                    <span className="font-medium">Ambulance</span>
                  </div>
                  <a href={`tel:${country.emergency.ambulance}`} className="text-primary font-bold hover:underline">
                    {country.emergency.ambulance}
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md"><Phone className="w-4 h-4 text-orange-500" /></div>
                    <span className="font-medium">Fire</span>
                  </div>
                  <a href={`tel:${country.emergency.fire}`} className="text-primary font-bold hover:underline">
                    {country.emergency.fire}
                  </a>
                </div>
                
                {country.emergency.touristPolice && (
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md"><ShieldAlert className="w-4 h-4 text-primary" /></div>
                      <span className="font-medium text-sm">Tourist Police</span>
                    </div>
                    <a href={`tel:${country.emergency.touristPolice}`} className="text-primary font-bold hover:underline text-sm">
                      {country.emergency.touristPolice}
                    </a>
                  </div>
                )}
                
                {country.emergency.embassyHotline && (
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md"><Building className="w-4 h-4" /></div>
                      <span className="font-medium text-sm">Embassy</span>
                    </div>
                    <a href={`tel:${country.emergency.embassyHotline}`} className="text-primary font-bold hover:underline text-sm">
                      {country.emergency.embassyHotline}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
