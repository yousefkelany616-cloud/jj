import { Country } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface CountryCardProps {
  country: Country;
  index?: number;
}

export function CountryCard({ country, index = 0 }: CountryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/countries/${country.code}`}>
        <Card className="overflow-hidden h-full flex flex-col hover-elevate cursor-pointer border-transparent hover:border-primary/20 transition-all duration-300 group">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={country.heroImage}
              alt={country.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-serif font-bold text-2xl flex items-center gap-2">
                    {country.name} <span className="text-xl">{country.flag}</span>
                  </h3>
                  <div className="flex items-center text-sm text-white/80 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {country.region}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-foreground leading-none">{country.activityCount}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wider font-medium mt-1">Adventures</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function CountryCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full border-transparent">
      <div className="relative aspect-video bg-muted animate-pulse" />
    </Card>
  );
}
