import { useEffect, useMemo, useRef, useState } from "react";
import { Activity } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Star, Clock, MapPin, DollarSign, CloudSun } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { localizeActivity } from "@/lib/activity-translations";

interface ActivityCardProps {
  activity: Activity;
  index?: number;
}

const SLIDE_INTERVAL_MS = 3000;

function CardImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (images.length <= 1 || !isVisible) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length, isVisible]);

  if (images.length <= 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading={i === 0 ? "eager" : "lazy"}
          aria-hidden={i === activeIndex ? undefined : true}
          className={
            "absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ease-in-out " +
            (i === activeIndex ? "opacity-100" : "opacity-0")
          }
        />
      ))}
    </div>
  );
}

export function ActivityCard({ activity: rawActivity, index = 0 }: ActivityCardProps) {
  const { lang } = useI18n();
  const activity = localizeActivity(rawActivity, lang)!;

  const slides = useMemo(() => {
    const ordered = [activity.heroImage, ...(activity.gallery ?? [])].filter(
      (s): s is string => typeof s === "string" && s.length > 0,
    );
    return Array.from(new Set(ordered));
  }, [activity.heroImage, activity.gallery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/activities/${activity.id}`}>
        <Card className="overflow-hidden h-full flex flex-col hover-elevate cursor-pointer border-transparent hover:border-primary/20 transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden group">
            <CardImageCarousel images={slides} alt={activity.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm hover:bg-background/90 text-xs font-medium">
                {activity.type}
              </Badge>
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm hover:bg-background/90 text-xs font-medium">
                {activity.difficulty}
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              <div className="text-white">
                <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-1 mb-1">{activity.name}</h3>
                <div className="flex items-center text-xs text-white/90 gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{activity.city}, {activity.countryName} {activity.countryFlag}</span>
                </div>
              </div>
              <div className="flex items-center bg-black/40 backdrop-blur-md rounded-md px-1.5 py-1 text-xs text-white shrink-0">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{activity.rating.toFixed(1)}</span>
                <span className="text-white/70 ml-1">({activity.reviewCount})</span>
              </div>
            </div>
          </div>
          <CardContent className="p-4 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.shortDescription}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activity.durationDays}d</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${activity.estimatedCost}</span>
            </div>
            <div className="flex items-center gap-1">
              <CloudSun className="w-3.5 h-3.5" />
              <span className="capitalize">{activity.weather}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-transparent">
      <div className="relative aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4 flex-1 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full animate-pulse" />
          <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="h-3 bg-muted rounded w-10 animate-pulse" />
        <div className="h-3 bg-muted rounded w-10 animate-pulse" />
        <div className="h-3 bg-muted rounded w-16 animate-pulse" />
      </CardFooter>
    </Card>
  );
}
