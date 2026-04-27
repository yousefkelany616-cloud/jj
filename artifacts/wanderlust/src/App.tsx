import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { ProtectedRoute } from "@/components/layout/protected-route";

import Home from "@/pages/home";
import Discover from "@/pages/discover";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Countries from "@/pages/countries";
import CountryDetail from "@/pages/country-detail";
import ActivityDetail from "@/pages/activity-detail";
import PackingList from "@/pages/packing-list";
import TripTracker from "@/pages/trip-tracker";
import Trips from "@/pages/trips";
import TripDetail from "@/pages/trip-detail";
import Favorites from "@/pages/favorites";
import Profile from "@/pages/profile";
import Emergency from "@/pages/emergency";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/login" component={Login} />
      <Route path="/countries" component={Countries} />
      <Route path="/countries/:code" component={CountryDetail} />
      <Route path="/activities/:id" component={ActivityDetail} />
      <Route path="/emergency" component={Emergency} />
      
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/activities/:id/packing" component={PackingList} />
      <ProtectedRoute path="/trip-tracker" component={TripTracker} />
      <ProtectedRoute path="/trips" component={Trips} />
      <ProtectedRoute path="/trips/:id" component={TripDetail} />
      <ProtectedRoute path="/favorites" component={Favorites} />
      <ProtectedRoute path="/profile" component={Profile} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
