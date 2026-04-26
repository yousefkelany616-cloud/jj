import { useGetSession } from "@workspace/api-client-react";
import { Redirect, Route, RouteProps } from "wouter";

export function ProtectedRoute({ component: Component, ...rest }: RouteProps) {
  const { data: session, isLoading } = useGetSession();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} component={Component} />;
}
