import { MainLayout } from "@/components/layout/main-layout";
import { useGetDashboardSummary, getGetSessionQueryKey } from "@workspace/api-client-react";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapPin, Heart, Compass, Route as RouteIcon, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ui/activity-card";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container px-4">
          <h1 className="text-4xl font-serif font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back. Ready for your next adventure?</p>
        </div>
      </div>

      <div className="container px-4 py-12 space-y-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse bg-muted/50 border-transparent h-32" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Adventures</CardTitle>
                <Compass className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-serif">{summary.totalAdventures}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Distance Tracked</CardTitle>
                <RouteIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-serif">{summary.totalDistanceKm.toFixed(1)} km</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Countries Visited</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-serif">{summary.countriesVisited}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saved Favorites</CardTitle>
                <Heart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-serif">{summary.favoritesCount}</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold">Recent Trips</h2>
              <Link href="/trips">
                <Button variant="ghost">View all</Button>
              </Link>
            </div>
            {summary?.recentTrips?.length === 0 ? (
              <div className="bg-muted/30 border border-dashed rounded-xl p-8 text-center">
                <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No trips recorded yet</h3>
                <p className="text-muted-foreground mb-4">Start tracking your adventures to see them here.</p>
                <Link href="/trip-tracker">
                  <Button>Start Tracker</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {summary?.recentTrips?.map(trip => (
                  <Card key={trip.id} className="overflow-hidden hover-elevate transition-all">
                    <Link href={`/trips/${trip.id}`}>
                      <div className="flex flex-col sm:flex-row cursor-pointer">
                        <div className="sm:w-48 h-32 bg-muted relative">
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                            <Map className="w-8 h-8 text-primary/40" />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-semibold text-lg">{trip.title}</h4>
                            {trip.activityName && <p className="text-sm text-muted-foreground">{trip.activityName}</p>}
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><RouteIcon className="w-3.5 h-3.5" /> {trip.distanceKm.toFixed(1)} km</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.round(trip.durationSec / 60)} min</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">Recommended for You</h2>
            <div className="flex flex-col gap-6">
              {summary?.recommended?.map((activity, i) => (
                <ActivityCard key={activity.id} activity={activity} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
