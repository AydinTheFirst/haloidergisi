import { zodResolver } from "@hookform/resolvers/zod";
import { Crew } from "@repo/db";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api-client";
import { userSchema, UserSchema } from "@/schemas/user";
import { List, User } from "@/types";

export const Route = createFileRoute("/dashboard/users/$userId")({
  component: RouteComponent,
  loader: async () => {
    const { data: crews } = await apiClient.get<List<Crew>>("/crews", {
      params: { limit: 1000 },
    });
    return { crews };
  },
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { crews } = Route.useLoaderData();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/users/${userId}`);
      return data;
    },
  });

  const navigate = useNavigate({ from: Route.id });

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    values: {
      name: user?.profile?.name ?? "",
      email: user?.email ?? "",
      password: undefined,
      crewId: user?.crewId ?? undefined,
    },
  });

  const onSubmit = async (data: UserSchema) => {
    try {
      await apiClient.patch(`/users/${userId}`, data);
      toast.success("Kullanıcı başarıyla güncellendi.");
      void navigate({ to: "/dashboard/users" });
    } catch (error) {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    }
  };

  return (
    <section>
      <Card className='mx-auto'>
        <CardHeader>
          <CardTitle>Kullanıcıyı Düzenle</CardTitle>
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
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kullanıcı adı en az 1 en fazla 100 karakter olabilir.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Geçerli bir e-posta adresi giriniz.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre (Opsiyonel)</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        autoComplete='new-password'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Şifreyi değiştirmek için yeni şifre giriniz (en az 6, en fazla 100 karakter).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='crewId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crew ID (Opsiyonel)</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                      value={field.value ?? "__none__"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='__none__'>Seçim yapılmadı</SelectItem>
                        {crews?.items.map((crew) => (
                          <SelectItem
                            key={crew.id}
                            value={crew.id}
                          >
                            {crew.name} (ID: {crew.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Kullanıcıyı bir crew'e atamak için crew ID'si giriniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
              >
                Güncelle
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
