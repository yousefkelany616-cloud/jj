import { useGetTrendingDestinations, useGetFeaturedActivities } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ActivityCard, ActivityCardSkeleton } from "@/components/ui/activity-card";
import { CountryCard, CountryCardSkeleton } from "@/components/ui/country-card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Compass, ArrowRight, Search, Map as MapIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

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
            <Compass className="w-16 h-16 mx-auto mb-6 opacity-80" />
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
