import { MainLayout } from "@/components/layout/main-layout";
import { useGetSession } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Compass, Trophy, Route, Star, Heart, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export default function Profile() {
  const { data: session } = useGetSession();
  const user = session?.user;
  const t = useT();

  if (!user) return null;

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-4xl font-serif bg-primary/10 text-primary">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-serif font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full shadow-sm border border-border/50">
                  <Route className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{user.completedTripsCount} {t("nav.myTrips")}</span>
                </div>
                <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full shadow-sm border border-border/50">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{user.favoritesCount} {t("nav.favorites")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-serif font-bold">{t("profile.achievements")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.achievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className={`h-full overflow-hidden transition-all ${achievement.unlocked ? 'border-primary/20 bg-primary/5' : 'opacity-70 grayscale border-dashed'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                      {achievement.icon}
                    </div>
                    {!achievement.unlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-2">{achievement.name}</h3>
                  <p className="text-muted-foreground text-sm">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
