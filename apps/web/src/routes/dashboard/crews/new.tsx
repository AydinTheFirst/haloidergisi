import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { crewSchema, CrewSchema } from "@/schemas/crew";

export const Route = createFileRoute("/dashboard/crews/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });

  const form = useForm<CrewSchema>({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CrewSchema) => {
    try {
      await apiClient.post("/crews", data);
      void navigate({ to: "/dashboard/crews" });
      toast.success("Crew başarıyla oluşturuldu.");
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  return (
    <Card className='mx-auto'>
      <CardHeader>
        <CardTitle>Yeni Crew Oluştur</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crew Adı</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Crew adı en az 1 en fazla 100 karakter olabilir.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              Oluştur
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
