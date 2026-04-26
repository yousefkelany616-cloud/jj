import { MainLayout } from "@/components/layout/main-layout";
import { useListTrips } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Map, Route, Clock, Calendar } from "lucide-react";

export default function Trips() {
  const { data: trips, isLoading } = useListTrips();

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container px-4">
          <h1 className="text-4xl font-serif font-bold mb-2">My Trips</h1>
          <p className="text-muted-foreground text-lg">Your adventure history and recorded paths.</p>
        </div>
      </div>

      <div className="container px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Card key={i} className="animate-pulse h-64 bg-muted/50 border-transparent" />)}
          </div>
        ) : trips?.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">No trips recorded yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Track your journey live using the tracker and build your personal expedition journal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips?.map(trip => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="overflow-hidden hover-elevate cursor-pointer h-full flex flex-col">
                  <div className="h-32 bg-primary/5 flex items-center justify-center border-b">
                    <Map className="w-10 h-10 text-primary/30" />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="font-serif font-bold text-xl mb-1">{trip.title}</h3>
                    {trip.activityName && <p className="text-muted-foreground text-sm mb-4">{trip.activityName}</p>}
                    
                    <div className="mt-auto space-y-2 pt-4">
                      <div className="flex items-center text-sm gap-2">
                        <Route className="w-4 h-4 text-primary" />
                        <span className="font-medium">{trip.distanceKm.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center text-sm gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(trip.durationSec / 60)} minutes</span>
                      </div>
                      <div className="flex items-center text-sm gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(trip.startedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
