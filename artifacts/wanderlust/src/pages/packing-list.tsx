import { MainLayout } from "@/components/layout/main-layout";
import { useGetPackingList, getGetPackingListQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  localizePackingCategory,
  localizePackingItem,
} from "@/lib/packing-translations";
import { localizeActivityName } from "@/lib/activity-translations";

export default function PackingList() {
  const { t, lang } = useI18n();
  const { id } = useParams<{ id: string }>();
  const { data: list, isLoading } = useGetPackingList(id, {
    query: { enabled: !!id, queryKey: getGetPackingListQueryKey(id) }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`packing-${id}`);
      if (saved) {
        try {
          setCheckedItems(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [id]);

  const toggleItem = (itemId: string, checked: boolean) => {
    const newChecked = { ...checkedItems, [itemId]: checked };
    setCheckedItems(newChecked);
    if (id) {
      localStorage.setItem(`packing-${id}`, JSON.stringify(newChecked));
    }
  };

  if (isLoading || !list) return (
    <MainLayout>
      <div className="container px-4 py-12 animate-pulse space-y-8">
        <div className="h-10 bg-muted w-1/3 rounded" />
        <div className="h-64 bg-muted w-full rounded" />
      </div>
    </MainLayout>
  );

  const totalItems = list.categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100);

  return (
    <MainLayout>
      <div className="bg-muted/30 border-b border-border/50 py-8">
        <div className="container px-4">
          <Link href={`/activities/${id}`}>
            <Button variant="ghost" className="pl-0 mb-4 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" /> {t("common.back")}
            </Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold mb-2">{t("packing.title")}</h1>
          <p className="text-muted-foreground text-lg">{localizeActivityName(list.activityName, lang)}</p>
        </div>
      </div>

      <div className="container px-4 py-12 max-w-4xl">
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-6 h-6 ${progress === 100 ? 'text-green-500' : 'text-primary'}`} />
                <h2 className="text-xl font-bold">{t("packing.progress")}</h2>
              </div>
              <span className="font-bold text-lg">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {checkedCount} / {totalItems}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-8">
          {list.categories.map((category) => (
            <div key={category.category}>
              <h3 className="text-2xl font-serif font-bold mb-4 capitalize border-b pb-2">{localizePackingCategory(category.category, lang)}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={item.id} 
                      checked={!!checkedItems[item.id]}
                      onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={item.id}
                        className={`text-base cursor-pointer ${checkedItems[item.id] ? 'text-muted-foreground line-through' : 'font-medium'}`}
                      >
                        {localizePackingItem(item.name, lang)}
                      </Label>
                      {item.essential && (
                        <p className="text-xs text-destructive font-medium uppercase tracking-wider">{t("packing.essential")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
