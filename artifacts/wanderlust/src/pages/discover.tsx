import { MainLayout } from "@/components/layout/main-layout";
import { useListActivities } from "@workspace/api-client-react";
import { ActivityCard, ActivityCardSkeleton } from "@/components/ui/activity-card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useDebounce } from "@/hooks/use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export default function Discover() {
  const t = useT();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 500);
  
  const [difficulty, setDifficulty] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const { data: activities, isLoading } = useListActivities({
    search: debouncedSearch || undefined,
    difficulty: difficulty !== "all" ? difficulty : undefined,
    type: type !== "all" ? type : undefined,
  });

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container px-4">
          <h1 className="text-4xl font-serif font-bold mb-6">{t("discover.title")}</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input
                placeholder={t("discover.searchPlaceholder")}
                className="pl-10 h-12 text-lg bg-background rtl:pl-3 rtl:pr-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[160px] h-12 bg-background">
                  <SelectValue placeholder={t("discover.anyDifficulty")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("discover.anyDifficulty")}</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[160px] h-12 bg-background">
                  <SelectValue placeholder={t("discover.anyType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("discover.anyType")}</SelectItem>
                  <SelectItem value="Hiking">Hiking</SelectItem>
                  <SelectItem value="Diving">Diving</SelectItem>
                  <SelectItem value="Snorkeling">Snorkeling</SelectItem>
                  <SelectItem value="Camping">Camping</SelectItem>
                  <SelectItem value="Safari">Safari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ActivityCardSkeleton key={i} />
            ))}
          </div>
        ) : activities?.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No adventures found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setSearch("");
                setDifficulty("all");
                setType("all");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities?.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
