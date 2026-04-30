import { useGetTrendingDestinations, useGetFeaturedActivities } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ActivityCard, ActivityCardSkeleton } from "@/components/ui/activity-card";
import { CountryCard, CountryCardSkeleton } from "@/components/ui/country-card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  Search,
  Map as MapIcon,
  Mountain,
  Waves,
  Tent,
  Fish,
  Truck,
  Sparkles,
  Globe,
  Sun,
  Calendar,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import atlasLogo from "@assets/atlas-adventures/atlas-adventures-logo.png";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

const ADVENTURE_TYPES = [
  {
    key: "diving",
    type: "Diving",
    image:
      "https://egyptunitedtours.com/wp-content/uploads/2025/08/Diving-Ras-Mohammed-National-Park-1024x683.webp",
    icon: Waves,
  },
  {
    key: "hiking",
    type: "Hiking",
    image:
      "https://www.weseektravel.com/wp-content/uploads/2022/05/mount-sinai-hike-in-egypt-11-1024x683.jpg",
    icon: Mountain,
  },
  {
    key: "snorkeling",
    type: "Snorkeling",
    image:
      "https://sofiescapes.com/wp-content/uploads/2023/10/Dolphin-Snorkel-Egypt-Swimming-Red-sea.jpg",
    icon: Fish,
  },
  {
    key: "camping",
    type: "Camping",
    image:
      "https://www.egypttoursplus.com/wp-content/uploads/2025/07/Bizarre-rock-formation-in-White-desert-Egypt-1.jpg",
    icon: Tent,
  },
  {
    key: "safari",
    type: "Safari",
    image:
      "https://www.shouf.io/cdn/shop/files/Great_Sand_sea_safari_3.jpg?v=2777696372178071396",
    icon: Truck,
  },
] as const;

export default function Home() {
  const { data: trending, isLoading: trendingLoading } = useGetTrendingDestinations();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedActivities();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const t = useT();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/discover?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=2069&auto=format&fit=crop"
          alt="Desert landscape"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-in fade-in duration-1000 slide-in-from-bottom-4"
        />
        
        <div className="container relative z-20 text-center px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={atlasLogo}
              alt="Atlas Adventures"
              className="h-28 md:h-32 w-auto mx-auto mb-6 object-contain drop-shadow-lg"
            />
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
              {t("home.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
              {t("home.subtitle")}
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-muted-foreground rtl:left-auto rtl:right-4" />
              <Input
                type="text"
                placeholder={t("home.searchPlaceholder")}
                className="w-full pl-12 pr-32 h-16 text-lg rounded-full bg-background/95 backdrop-blur border-none shadow-xl text-foreground placeholder:text-muted-foreground rtl:pl-32 rtl:pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" size="lg" className="absolute right-2 rounded-full h-12 px-6 rtl:right-auto rtl:left-2">
                {t("home.search")}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">{t("home.featured")}</h2>
            </div>
            <Link href="/discover">
              <Button variant="ghost" className="hidden sm:flex group">
                {t("home.viewAll")} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading
              ? Array.from({ length: 4 }).map((_, i) => <ActivityCardSkeleton key={i} />)
              : featured?.map((activity, i) => (
                  <ActivityCard key={activity.id} activity={activity} index={i} />
                ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/discover">
              <Button variant="outline" className="w-full">
                View all adventures
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-20 bg-muted/50 border-y border-border/50">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">{t("home.trending")}</h2>
            </div>
            <Link href="/countries">
              <Button variant="ghost" className="hidden sm:flex group">
                {t("home.viewAll")} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:ml-0 rtl:mr-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingLoading
              ? Array.from({ length: 3 }).map((_, i) => <CountryCardSkeleton key={i} />)
              : trending?.map((dest, i) => (
                  <CountryCard 
                    key={dest.countryCode} 
                    country={{
                      code: dest.countryCode,
                      name: dest.countryName,
                      flag: dest.flag,
                      heroImage: dest.heroImage,
                      activityCount: dest.activityCount,
                      region: "Middle East" // default for trending if not returned
                    }} 
                    index={i} 
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Adventure Types */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">{t("home.types.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.types.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ADVENTURE_TYPES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link href={`/discover?type=${item.type}`}>
                    <div className="group relative block h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <img
                        src={item.image}
                        alt={t(`home.types.${item.key}` as any)}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                        <Icon className="w-8 h-8 mb-2 opacity-90" />
                        <h3 className="text-2xl font-serif font-bold">{t(`home.types.${item.key}` as any)}</h3>
                        <span className="mt-1 inline-flex items-center gap-1 text-sm opacity-90 group-hover:gap-2 transition-all">
                          {t("home.types.explore")}
                          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Egypt — Stats Strip */}
      <section className="py-20 bg-muted/50 border-y border-border/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">{t("home.stats.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.stats.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, value: "8", label: t("home.stats.adventures") },
              { icon: Globe, value: "5", label: t("home.stats.types") },
              { icon: Waves, value: "1,200", label: t("home.stats.coast") },
              { icon: Sun, value: "Oct–Apr", label: t("home.stats.season") },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-background rounded-2xl p-6 text-center shadow-sm"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-serif font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Travel Essentials */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">{t("home.essentials.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("home.essentials.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Calendar, titleKey: "home.essentials.season.title", bodyKey: "home.essentials.season.body" },
              { icon: Wallet, titleKey: "home.essentials.currency.title", bodyKey: "home.essentials.currency.body" },
              { icon: ShieldCheck, titleKey: "home.essentials.safety.title", bodyKey: "home.essentials.safety.body" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2">{t(card.titleKey as any)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(card.bodyKey as any)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container relative z-10 px-4 text-center">
          <MapIcon className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl font-serif font-bold mb-4">Track Your Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Record your path, monitor your stats, and build your personal expedition journal with our live trip tracker.
          </p>
          <Link href="/trip-tracker">
            <Button size="lg" className="text-lg px-8 rounded-full h-14">
              Start Tracking Now
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
