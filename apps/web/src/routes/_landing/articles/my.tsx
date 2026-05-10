import { Icon } from "@iconify/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api-client";
import { Article, ArticleStatus } from "@/types";

export const Route = createFileRoute("/_landing/articles/my")({
  component: MyArticlesPage,
});

function MyArticlesPage() {
  const queryClient = useQueryClient();
  const { data: articles } = useQuery({
    queryKey: ["my-articles"],
    queryFn: async () => {
      const { data } = await apiClient.get<Article[]>("/articles/my");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/articles/${id}`);
    },
    onSuccess: () => {
      toast.success("Yazı silindi.");
      void queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    },
    onError: (error) => toast.error(apiClient.resolveApiError(error).message),
  });

  const canEdit = (status: ArticleStatus) => status === "PENDING" || status === "REVISION_REQ";
  const canDelete = (status: ArticleStatus) =>
    status === "PENDING" || status === "REVISION_REQ" || status === "REJECTED";

  return (
    <div className='container mx-auto px-4 py-10 text-center sm:text-left'>
      <h1 className='mb-8 text-3xl font-bold'>Gönderdiğim Yazılar</h1>

      <div className='mx-auto max-w-4xl space-y-4 sm:mx-0'>
        {articles?.map((article) => (
          <Card
            key={article.id}
            className='overflow-hidden'
          >
            <CardHeader className='pb-4'>
              <div className='flex flex-col items-start justify-between gap-4 sm:flex-row'>
                <div className='space-y-1'>
                  <CardTitle className='text-xl'>{article.title}</CardTitle>
                  <p className='text-muted-foreground text-sm'>
                    İlan: {article.call?.title} | Tarih:{" "}
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex w-full flex-col items-end gap-3 sm:w-auto'>
                  <StatusBadge status={article.status as ArticleStatus} />
                  <div className='flex w-full flex-wrap justify-end gap-2 sm:w-auto'>
                    <Button
                      variant='outline'
                      size='sm'
                      asChild
                    >
                      <Link
                        to='/articles/$articleId'
                        params={{ articleId: article.id }}
                      >
                        <Icon
                          icon='mdi:eye'
                          className='mr-1 h-4 w-4'
                        />
                        Görüntüle
                      </Link>
                    </Button>
                    {canEdit(article.status as ArticleStatus) && (
                      <Button
                        variant='outline'
                        size='sm'
                        asChild
                      >
                        <Link
                          to='/articles/submit/$callId'
                          params={{ callId: article.callId }}
                        >
                          <Icon
                            icon='mdi:edit'
                            className='mr-1 h-4 w-4'
                          />
                          Düzenle
                        </Link>
                      </Button>
                    )}
                    {canDelete(article.status as ArticleStatus) && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-destructive hover:bg-destructive/10'
                        onClick={() => {
                          if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
                            deleteMutation.mutate(article.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Icon
                          icon='mdi:trash-can-outline'
                          className='mr-1 h-4 w-4'
                        />
                        Sil
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {article.adminNote && (
                <div className='rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm italic dark:border-amber-900 dark:bg-amber-950/20'>
                  <strong className='text-amber-800 dark:text-amber-400'>Editör Notu:</strong>
                  <p className='mt-1 text-amber-700 dark:text-amber-500'>{article.adminNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {articles?.length === 0 && (
          <div className='bg-muted/30 rounded-lg border-2 border-dashed py-20 text-center'>
            <Icon
              icon='solar:document-add-bold-duotone'
              className='text-muted-foreground mx-auto mb-4 h-12 w-12'
            />
            <p className='text-lg font-medium'>Henüz bir yazı göndermemişsiniz.</p>
            <Button
              asChild
              variant='link'
              className='mt-2'
            >
              <Link to='/articles'>İlanları gör ve ilk yazını gönder</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  const colors: Record<ArticleStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWING: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    REVISION_REQ: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
}
