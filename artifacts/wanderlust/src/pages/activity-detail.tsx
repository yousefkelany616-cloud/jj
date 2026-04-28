import { MainLayout } from "@/components/layout/main-layout";
import { useGetActivity, getGetActivityQueryKey, useAddFavorite, useRemoveFavorite } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { MapPin, Clock, DollarSign, CloudSun, Heart, Navigation, Star, Shield, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useI18n } from "@/lib/i18n";
import { localizeActivity } from "@/lib/activity-translations";

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t, lang } = useI18n();

  const { data: rawActivity, isLoading } = useGetActivity(id, {
    query: { enabled: !!id, queryKey: getGetActivityQueryKey(id) },
  });

  const activity = localizeActivity(rawActivity, lang);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleFavoriteToggle = async () => {
    if (!activity) return;
    try {
      if (activity.isFavorited) {
        await removeFavorite.mutateAsync({ id });
      } else {
        await addFavorite.mutateAsync({ id });
      }
      queryClient.invalidateQueries({ queryKey: getGetActivityQueryKey(id) });
      toast({ title: activity.isFavorited ? t("activity.removeFavorite") : t("activity.addFavorite") });
    } catch (e) {
      toast({ title: t("nav.signIn"), variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse container px-4 py-8">
          <div className="h-10 bg-muted w-1/3 rounded mb-8" />
          <div className="h-[60vh] bg-muted w-full rounded-2xl mb-8" />
        </div>
      </MainLayout>
    );
  }

  if (!activity) return null;

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex gap-2 mb-3">
              <Badge variant="secondary">{activity.type}</Badge>
              <Badge variant={activity.difficulty === "extreme" ? "destructive" : "outline"}>{activity.difficulty}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{activity.name}</h1>
            <div className="flex items-center text-muted-foreground gap-4">
              <Link href={`/countries/${activity.countryCode}`} className="flex items-center hover:text-primary transition-colors">
                <MapPin className="w-4 h-4 mr-1" />
                {activity.city}, {activity.countryName} {activity.countryFlag}
              </Link>
              <div className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-medium text-foreground">{activity.rating.toFixed(1)}</span>
                <span className="ml-1 text-muted-foreground">({activity.reviewCount} {t("activity.reviews")})</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={activity.isFavorited ? "default" : "outline"} 
              size="icon"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`w-5 h-5 ${activity.isFavorited ? "fill-current" : ""}`} />
            </Button>
            <Link href={`/activities/${activity.id}/packing`}>
              <Button variant="outline" className="gap-2">
                <Shield className="w-4 h-4" />
                {t("packing.title")}
              </Button>
            </Link>
            <Link href="/trip-tracker">
              <Button className="gap-2">
                <Navigation className="w-4 h-4" />
                {t("nav.trackTrip")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[60vh] min-h-[400px]">
          <div className="md:col-span-3 rounded-2xl overflow-hidden">
            <img src="https://www.zubludiving.com/images/Belize/Turrneffe-Atoll-Lighthouse-Reef-Great-Blue-Hole/Turneffe-Atoll-Lighthouse-Reef-Great-Blue-Hole-Belize-Diving-10.jpg" alt={activity.name} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {activity.gallery.slice(0, 2).map((img, i) => (
              <div key={i} className="flex-1 rounded-2xl overflow-hidden relative group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                {i === 1 && activity.gallery.length > 2 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-colors">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="font-medium">+{activity.gallery.length - 2} more</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-serif font-bold mb-6">{t("activity.about")}</h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">{t("activity.highlights")}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activity.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
                    <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-serif font-bold mb-6">{t("activity.location")}</h2>
              <div className="h-[400px] rounded-2xl overflow-hidden border">
                <MapContainer center={[activity.latitude, activity.longitude]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[activity.latitude, activity.longitude]}>
                    <Popup>{activity.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 space-y-6 sticky top-24">
              <h3 className="font-serif font-bold text-xl">{t("activity.quickFacts")}</h3>

              <div className="flex items-center gap-4">
                <div className="bg-background p-3 rounded-xl shadow-sm"><Clock className="w-6 h-6 text-primary" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("activity.duration")}</div>
                  <div className="font-semibold">{activity.durationDays} {t("activity.days")}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-background p-3 rounded-xl shadow-sm"><DollarSign className="w-6 h-6 text-primary" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("activity.cost")}</div>
                  <div className="font-semibold">${activity.estimatedCost}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-background p-3 rounded-xl shadow-sm"><CloudSun className="w-6 h-6 text-primary" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("activity.bestTime")}</div>
                  <div className="font-semibold">{activity.bestTimeToVisit}</div>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h4 className="font-medium mb-3">{t("activity.gear")}</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.requiredGear.map(gear => (
                    <Badge key={gear} variant="outline" className="bg-background">{gear}</Badge>
                  ))}
                </div>
                <Link href={`/activities/${activity.id}/packing`}>
                  <Button variant="link" className="px-0 mt-2 text-primary">{t("activity.packing")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
