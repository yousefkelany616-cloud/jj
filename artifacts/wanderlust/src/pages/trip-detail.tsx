import { MainLayout } from "@/components/layout/main-layout";
import { useGetTrip, getGetTripQueryKey, useDeleteTrip, getListTripsQueryKey } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Route, Timer, Activity, Calendar, MapPin, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const deleteTrip = useDeleteTrip();

  const { data: trip, isLoading } = useGetTrip(id, {
    query: { enabled: !!id, queryKey: getGetTripQueryKey(id) }
  });

  const handleDelete = async () => {
    try {
      await deleteTrip.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast({ title: "Trip deleted successfully" });
      setLocation("/trips");
    } catch (e) {
      toast({ title: "Failed to delete trip", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip?.title,
          text: `Check out my trip on Wanderlust!`,
          url,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Link copied to clipboard" });
    }
  };

  if (isLoading || !trip) return (
    <MainLayout>
      <div className="container px-4 py-12 animate-pulse space-y-8">
        <div className="h-10 bg-muted w-1/3 rounded" />
        <div className="h-[50vh] bg-muted w-full rounded-xl" />
      </div>
    </MainLayout>
  );

  const center = trip.path.length > 0 
    ? [trip.path[0].lat, trip.path[0].lng] as [number, number] 
    : [0, 0] as [number, number];

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">{trip.title}</h1>
            <div className="flex items-center text-muted-foreground gap-4">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(trip.startedAt).toLocaleDateString()}</span>
              {trip.activityName && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip.activityName}</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the trip data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary"><Route className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Distance</p>
                <p className="text-2xl font-bold font-mono">{trip.distanceKm.toFixed(2)} km</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary"><Timer className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Duration</p>
                <p className="text-2xl font-bold font-mono">{Math.round(trip.durationSec / 60)} min</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary"><Activity className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg Speed</p>
                <p className="text-2xl font-bold font-mono">{trip.avgSpeedKmh.toFixed(1)} km/h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {trip.path.length > 0 && (
          <div className="h-[60vh] min-h-[500px] rounded-2xl overflow-hidden border shadow-lg relative z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="w-full h-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline positions={trip.path.map(p => [p.lat, p.lng])} color="hsl(var(--primary))" weight={4} />
              <Marker position={[trip.path[0].lat, trip.path[0].lng]} />
              <Marker position={[trip.path[trip.path.length-1].lat, trip.path[trip.path.length-1].lng]} />
            </MapContainer>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
