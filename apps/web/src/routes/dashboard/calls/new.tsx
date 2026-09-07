import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api-client";

const formSchema = z.object({
  title: z.string().min(1, "İlan adı zorunludur."),
  description: z.string().optional(),
  startDate: z.string().min(1, "Başlangıç tarihi zorunludur."),
  endDate: z.string().min(1, "Bitiş tarihi zorunludur."),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/dashboard/calls/new")({
  component: NewCallPage,
});

function NewCallPage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await apiClient.post("/submission-calls", values);
    },
    onSuccess: () => {
      toast.success("İlan başarıyla oluşturuldu.");
      void navigate({ to: "/dashboard/calls", search: {} as never });
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message);
    },
  });

  return (
    <div className='max-w-2xl space-y-6'>
      <h2 className='text-2xl font-bold'>Yeni Yazı Kabul İlanı</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlan Başlığı</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Açıklama</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlangıç Tarihi</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bitiş Tarihi</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type='submit'
            disabled={mutation.isPending}
          >
            Oluştur
          </Button>
        </form>
      </Form>
    </div>
  );
}
