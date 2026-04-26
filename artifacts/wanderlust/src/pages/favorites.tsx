import { MainLayout } from "@/components/layout/main-layout";
import { useListFavorites } from "@workspace/api-client-react";
import { ActivityCard, ActivityCardSkeleton } from "@/components/ui/activity-card";
import { Search, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { data: favorites, isLoading } = useListFavorites();

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-4xl font-serif font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground text-lg">Your curated collection of adventures.</p>
        </div>
      </div>

      <div className="container px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ActivityCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites?.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't saved any adventures to your favorites list. Start exploring to build your dream itinerary.
            </p>
            <Link href="/discover">
              <Button size="lg">Discover Adventures</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites?.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
