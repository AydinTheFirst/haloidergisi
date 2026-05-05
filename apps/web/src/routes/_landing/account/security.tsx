import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api-client";

const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Mevcut parola gereklidir." }),
  newPassword: z.string().min(6, { message: "Yeni parola en az 6 karakter olmalıdır." }),
  confirmNewPassword: z.string().min(6, { message: "Yeni parola onayı gereklidir." }),
});

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export const Route = createFileRoute("/_landing/account/security")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Yeni parolalar eşleşmiyor.");
      return;
    }

    try {
      await apiClient.patch("/account/password", data);
      toast.success("Parolanız başarıyla değiştirildi.");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error(apiClient.resolveApiError(error).message);
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-2 text-2xl font-semibold'>Parolayı Değiştir</h2>
        <p className='text-muted-foreground text-sm'>
          Hesabınızın güvenliği için güçlü bir parola kullanın.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mx-auto space-y-4'
        >
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mevcut Parola</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      className='pr-10'
                      {...field}
                    />
                    <button
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      type='button'
                      className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
                    >
                      <Icon icon={isPasswordVisible ? "mdi:eye-off" : "mdi:eye"} />
                    </button>
                  </div>
                </FormControl>
                <FormDescription>Mevcut parolanızı girin.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yeni Parola</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      className='pr-10'
                      {...field}
                    />
                    <button
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      type='button'
                      className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
                    >
                      <Icon icon={isPasswordVisible ? "mdi:eye-off" : "mdi:eye"} />
                    </button>
                  </div>
                </FormControl>
                <FormDescription>En az 6 karakter olmalıdır.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmNewPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Yeni Parola (Tekrar)</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      className='pr-10'
                      {...field}
                    />
                    <button
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      type='button'
                      className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
                    >
                      <Icon icon={isPasswordVisible ? "mdi:eye-off" : "mdi:eye"} />
                    </button>
                  </div>
                </FormControl>
                <FormDescription>Yeni parolanızı tekrar girin.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end pt-4'>
            <Button type='submit'>Parolayı Güncelle</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
