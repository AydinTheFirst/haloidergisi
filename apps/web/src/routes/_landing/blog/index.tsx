import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import apiClient from "@/lib/api-client";
import { News } from "@/types";

export const Route = createFileRoute("/_landing/blog/")({
  component: BlogLandingPage,
});

function BlogLandingPage() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await apiClient.get<News[]>("/news");
      return data;
    },
  });

  return (
    <div className='container mx-auto max-w-5xl px-4 py-12'>
      <div className='mb-12 space-y-4'>
        <Badge
          variant='outline'
          className='px-3 py-1'
        >
          <Icon
            icon='solar:globus-bold-duotone'
            className='text-primary mr-2'
          />
          HALO Gündem
        </Badge>
        <h1 className='text-4xl font-extrabold tracking-tight md:text-5xl'>Blog & Duyurular</h1>
        <p className='text-muted-foreground max-w-2xl text-xl'>
          HALO Dergisi'nden en son haberler, güncellemeler ve topluluk duyuruları.
        </p>
      </div>

      {isLoading ? (
        <div className='grid gap-8 md:grid-cols-2'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='bg-muted h-64 animate-pulse rounded-xl'
            />
          ))}
        </div>
      ) : (
        <div className='grid gap-8 md:grid-cols-2'>
          {news?.map((item) => (
            <Link
              key={item.id}
              to='/blog/$slug'
              params={{ slug: item.slug }}
              className='group'
            >
              <Card className='group-hover:border-primary group-hover:shadow-primary/5 h-full overflow-hidden border-2 transition-all duration-300 group-hover:shadow-lg'>
                <CardHeader>
                  <div className='mb-3 flex items-center justify-between'>
                    <span className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
                      <Icon icon='solar:calendar-linear' />
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("tr-TR")
                        : "Taslak"}
                    </span>
                    {item.keywords && (
                      <div className='flex gap-2'>
                        {item.keywords
                          .split(",")
                          .slice(0, 2)
                          .map((k) => (
                            <Badge
                              key={k}
                              variant='secondary'
                              className='text-[10px] tracking-wider uppercase'
                            >
                              {k.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                  <CardTitle className='group-hover:text-primary text-2xl leading-tight transition-colors'>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground line-clamp-3 leading-relaxed'>
                    {item.content.replace(/[#*`]/g, "").slice(0, 160)}...
                  </p>
                </CardContent>
                <CardFooter className='pt-0'>
                  <div className='text-primary flex items-center text-sm font-bold transition-transform group-hover:translate-x-1'>
                    Devamını Oku
                    <Icon
                      icon='solar:arrow-right-linear'
                      className='ml-2'
                    />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && news?.length === 0 && (
        <div className='bg-muted/30 rounded-2xl border-2 border-dashed py-20 text-center'>
          <Icon
            icon='solar:document-add-bold-duotone'
            className='text-muted-foreground mx-auto mb-4 h-16 w-16'
          />
          <h3 className='text-xl font-bold'>Henüz bir paylaşım yok</h3>
          <p className='text-muted-foreground mt-2'>Daha sonra tekrar kontrol edin.</p>
        </div>
      )}
    </div>
  );
}
