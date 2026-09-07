import { zodResolver } from "@hookform/resolvers/zod";
import { Crew } from "@repo/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAuth } from "@/hooks/use-auth";
import apiClient from "@/lib/api-client";
import { userSchema, UserSchema } from "@/schemas/user";
import { List, Role } from "@/types";

const ASSIGNABLE_ROLES: Role[] = ["USER", "ADMIN", "SUPER_ADMIN"];

export const Route = createFileRoute("/dashboard/users/new")({
  component: RouteComponent,
  loader: async () => {
    const { data: crews } = await apiClient.get<List<Crew>>("/crews", {
      params: { limit: 1000 },
    });
    return { crews };
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.id });
  const { crews } = Route.useLoaderData();
  const { data: viewer } = useAuth();
  const canSetRoles = Boolean(viewer?.roles.includes("SUPER_ADMIN"));

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      crewId: undefined,
      roles: ["USER"],
    },
  });

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (data: UserSchema) => {
      await apiClient.post("/users", data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Kullanıcı başarıyla oluşturuldu.");
      void navigate({ to: "/dashboard/users" });
    },
    onError: (error) => {
      const resolved = apiClient.resolveApiError(error);
      toast.error(resolved.message, {
        description: resolved.error,
      });
    },
  });

  const onSubmit = (data: UserSchema) => {
    const { roles, ...rest } = data;
    createMutation.mutate(canSetRoles ? { ...rest, roles } : rest);
  };

  return (
    <Card className='mx-auto'>
      <CardHeader>
        <CardTitle>Yeni Kullanıcı Oluştur</CardTitle>
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
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Şifre en az 6 en fazla 100 karakter olmalıdır.</FormDescription>
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
                      {crews.items.map((crew) => (
                        <SelectItem
                          key={crew.id}
                          value={crew.id}
                        >
                          {crew.name}
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

            {canSetRoles && (
              <FormField
                control={form.control}
                name='roles'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roller</FormLabel>
                    <div className='flex flex-col gap-2'>
                      {ASSIGNABLE_ROLES.map((role) => (
                        <div
                          key={role}
                          className='flex items-center gap-2'
                        >
                          <Checkbox
                            checked={field.value?.includes(role) ?? false}
                            onCheckedChange={(checked) => {
                              const current = field.value ?? [];
                              field.onChange(
                                checked ? [...current, role] : current.filter((r) => r !== role),
                              );
                            }}
                          />
                          <span className='text-sm'>{role}</span>
                        </div>
                      ))}
                    </div>
                    <FormDescription>Kullanıcıya atanacak rolleri seçiniz.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type='submit'
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
