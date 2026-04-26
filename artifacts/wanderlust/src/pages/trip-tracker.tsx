import { MainLayout } from "@/components/layout/main-layout";
import { useState, useEffect, useRef } from "react";
import { useCreateTrip, TripPoint } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import { Play, Square, Pause, Route, Timer, Activity as SpeedIcon, Navigation2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function TripTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [path, setPath] = useState<TripPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const createTrip = useCreateTrip();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Haversine formula for distance
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const totalDistance = path.reduce((acc, point, i) => {
    if (i === 0) return 0;
    return acc + getDistance(path[i-1].lat, path[i-1].lng, point.lat, point.lng);
  }, 0);

  const currentSpeed = path.length >= 2 
    ? (getDistance(path[path.length-2].lat, path[path.length-2].lng, path[path.length-1].lat, path[path.length-1].lng) / 
      ((path[path.length-1].timestamp - path[path.length-2].timestamp) / 3600000)) || 0
    : 0;

  const avgSpeed = duration > 0 ? (totalDistance / (duration / 3600)) : 0;

  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPath(prev => [...prev, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: Date.now()
          }]);
        },
        (err) => {
          setError("Location access denied or unavailable.");
          setIsTracking(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isTracking, isPaused]);

  const handleStart = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setIsTracking(true);
    setIsPaused(false);
  };

  const handlePause = () => setIsPaused(true);

  const handleStop = async () => {
    setIsTracking(false);
    setIsPaused(false);
    if (path.length > 1) {
      try {
        const res = await createTrip.mutateAsync({
          data: {
            title: `Trip on ${new Date().toLocaleDateString()}`,
            startedAt: new Date(path[0].timestamp).toISOString(),
            endedAt: new Date(path[path.length - 1].timestamp).toISOString(),
            distanceKm: totalDistance,
            durationSec: duration,
            avgSpeedKmh: avgSpeed,
            path
          }
        });
        toast({ title: "Trip saved successfully!" });
        setLocation(`/trips/${res.id}`);
      } catch (e) {
        toast({ title: "Failed to save trip", variant: "destructive" });
      }
    } else {
      toast({ title: "Not enough data to save trip", variant: "destructive" });
      setPath([]);
      setDuration(0);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container px-4 py-20 text-center max-w-lg mx-auto">
          <div className="bg-destructive/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Navigation2 className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Location Access Required</h2>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={() => setError(null)}>Try Again</Button>
        </div>
      </MainLayout>
    );
  }

  const center = path.length > 0 ? [path[path.length-1].lat, path[path.length-1].lng] as [number, number] : [25.2048, 55.2708] as [number, number];

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="flex-1 relative z-0">
          <MapContainer center={center} zoom={15} scrollWheelZoom={true} className="w-full h-full" zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {path.length > 0 && (
              <>
                <Polyline positions={path.map(p => [p.lat, p.lng])} color="hsl(var(--primary))" weight={4} />
                <Marker position={[path[path.length-1].lat, path[path.length-1].lng]} />
              </>
            )}
          </MapContainer>

          <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
            <Card className="pointer-events-auto bg-background/95 backdrop-blur shadow-xl border-primary/20 w-full max-w-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center divide-x">
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mb-1">
                      <Route className="w-4 h-4" /> Distance
                    </div>
                    <div className="text-2xl font-bold font-mono">{totalDistance.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">km</span></div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mb-1">
                      <Timer className="w-4 h-4" /> Time
                    </div>
                    <div className="text-2xl font-bold font-mono">{formatTime(duration)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mb-1">
                      <SpeedIcon className="w-4 h-4" /> Speed
                    </div>
                    <div className="text-2xl font-bold font-mono">{currentSpeed.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">km/h</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-[1000] flex justify-center gap-4 pointer-events-none">
            {!isTracking && !isPaused ? (
              <Button size="lg" className="rounded-full w-20 h-20 shadow-xl pointer-events-auto" onClick={handleStart}>
                <Play className="w-8 h-8 ml-1" />
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button size="lg" className="rounded-full w-16 h-16 shadow-xl pointer-events-auto bg-green-600 hover:bg-green-700 text-white" onClick={handleStart}>
                    <Play className="w-6 h-6 ml-1" />
                  </Button>
                ) : (
                  <Button size="lg" variant="secondary" className="rounded-full w-16 h-16 shadow-xl pointer-events-auto" onClick={handlePause}>
                    <Pause className="w-6 h-6" />
                  </Button>
                )}
                <Button size="lg" variant="destructive" className="rounded-full w-16 h-16 shadow-xl pointer-events-auto" onClick={handleStop}>
                  <Square className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
