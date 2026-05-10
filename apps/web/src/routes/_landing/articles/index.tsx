import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import apiClient from "@/lib/api-client";
import { SubmissionCall, Article } from "@/types";

export const Route = createFileRoute("/_landing/articles/")({
  component: ArticlesLanding,
});

function ArticlesLanding() {
  const { data: user } = useAuth();

  const { data: activeCalls } = useQuery({
    queryKey: ["active-calls"],
    queryFn: async () => {
      const { data } = await apiClient.get<SubmissionCall[]>("/submission-calls/active");
      return data;
    },
  });

  const { data: myArticles } = useQuery({
    queryKey: ["my-articles"],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await apiClient.get<Article[]>("/articles/my");
      return data;
    },
    enabled: !!user,
  });

  const getArticleForCall = (callId: string) => {
    return myArticles?.find((a) => a.callId === callId);
  };

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Yazı Gönderimi</h1>
        {user && (
          <Button
            asChild
            variant='outline'
          >
            <Link to='/articles/my'>Yazılarım</Link>
          </Button>
        )}
      </div>

      <p className='text-muted-foreground mb-10'>
        HALO Dergisi için açık olan yazı kabul ilanlarını aşağıda görebilirsiniz. İlginizi çeken bir
        ilan seçerek yazınızı gönderebilirsiniz.
      </p>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {activeCalls?.map((call) => {
          const existingArticle = getArticleForCall(call.id);
          const canEdit =
            !existingArticle ||
            existingArticle.status === "PENDING" ||
            existingArticle.status === "REVISION_REQ";

          return (
            <Card
              key={call.id}
              className='flex flex-col'
            >
              <CardHeader>
                <CardTitle>{call.title}</CardTitle>
                <CardDescription>
                  Son Tarih: {new Date(call.endDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className='grow'>
                <p className='line-clamp-3'>{call.description}</p>
                {existingArticle && (
                  <div className='bg-muted mt-4 rounded p-2 text-xs'>
                    <span className='font-semibold text-blue-600'>Durum:</span>{" "}
                    {existingArticle.status}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {existingArticle ? (
                  <Button
                    asChild
                    className='w-full'
                    variant='outline'
                  >
                    {canEdit ? (
                      <Link
                        to='/articles/submit/$callId'
                        params={{ callId: call.id }}
                      >
                        Yazıyı Düzenle
                      </Link>
                    ) : (
                      <Link
                        to='/articles/$articleId'
                        params={{ articleId: existingArticle.id }}
                      >
                        Yazıyı Görüntüle
                      </Link>
                    )}
                  </Button>
                ) : (
                  <Button
                    asChild
                    className='w-full'
                  >
                    <Link
                      to='/articles/submit/$callId'
                      params={{ callId: call.id }}
                    >
                      Yazı Gönder
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
        {activeCalls?.length === 0 && (
          <div className='bg-muted/30 col-span-full rounded-lg py-20 text-center'>
            <p className='text-xl font-medium'>Şu an aktif bir yazı kabul ilanı bulunmamaktadır.</p>
            <p className='text-muted-foreground mt-2'>Daha sonra tekrar kontrol edebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
