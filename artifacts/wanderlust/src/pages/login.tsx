import { useLogin, useGetSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { getGetSessionQueryKey } from "@workspace/api-client-react";
import { Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export default function Login() {
  const { data: session } = useGetSession();
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (session?.user) {
    setLocation("/dashboard");
    return null;
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", name: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await loginMutation.mutateAsync({ data: values });
      queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey() });
      toast({ title: "Welcome to Wanderlust!" });
      setLocation("/dashboard");
    } catch (e) {
      toast({ title: "Login failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-[100dvh] grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-muted">
        <img
          src="https://images.unsplash.com/photo-1547823065-4cbbb2d4d185?q=80&w=2070&auto=format&fit=crop"
          alt="Desert landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-white text-center">
            <Compass className="w-16 h-16 mx-auto mb-8 opacity-80" />
            <h1 className="text-4xl font-serif font-bold mb-4">Adventure Awaits</h1>
            <p className="text-lg text-white/80">Turn your wanderlust into action. Discover, plan, and track your journeys across the Arab world and beyond.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold tracking-tight">Sign In</h2>
            <p className="text-muted-foreground mt-2">Enter your details to continue your journey.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Name</Label>
                    <FormControl>
                      <Input placeholder="Ibn Battuta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input type="email" placeholder="explorer@wanderlust.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Start Exploring"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
