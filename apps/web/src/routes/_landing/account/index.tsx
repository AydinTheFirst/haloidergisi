import { Button } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import z from "zod";

import { useAuth } from "@/hooks/use-auth";

import {
  AccountSettingsPanel,
  ChangePasswordPanel,
  DeleteAccountPanel,
  NotificationsPanel,
  ProvidersPanel,
  UpdateProfilePanel,
} from "./-components";

const searchSchema = z.object({
  tab: z.string().optional(),
});

type Search = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_landing/account/")({
  validateSearch: (search): Search => searchSchema.parse(search),
  loaderDeps: ({ search: { tab } }: { search: Search }) => ({ tab }),
  component: RouteComponent,
});

const tabs = [
  {
    value: "update-profile",
    label: "Profili Güncelle",
    icon: "mdi:account-circle",
    panel: UpdateProfilePanel,
  },
  {
    value: "update-account",
    label: "Hesap Ayarları",
    icon: "mdi:cog-outline",
    panel: AccountSettingsPanel,
  },
  {
    value: "change-password",
    label: "Parolayı Değiştir",
    icon: "mdi:lock-outline",
    panel: ChangePasswordPanel,
  },
  {
    value: "providers",
    label: "Bağlı Hesaplar",
    icon: "mdi:account-switch-outline",
    panel: ProvidersPanel,
  },
  {
    value: "notifications",
    label: "Bildirimler",
    icon: "mdi:bell-outline",
    panel: NotificationsPanel,
  },
  {
    value: "delete-account",
    label: "Hesabı Sil",
    icon: "mdi:account-remove-outline",
    panel: DeleteAccountPanel,
  },
];

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { tab = "update-profile" } = useSearch({ from: Route.id });
  const { data: user } = useAuth();

  if (!user) return null;

  const ActivePanel = tabs.find((t) => t.value === tab)?.panel || UpdateProfilePanel;

  return (
    <div className='from-background via-background to-muted/20 min-h-screen bg-linear-to-br'>
      <div className='container max-w-7xl px-4 py-16'>
        {/* Header */}
        <div className='mb-12'>
          <h1 className='mb-3 text-4xl font-bold tracking-tight'>Hesap Ayarları</h1>
          <p className='text-muted-foreground text-lg'>
            Hoş geldiniz, <span className='text-foreground font-medium'>{user.profile?.name}</span>
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
          {/* Sidebar Navigation */}
          <nav className='lg:sticky lg:top-8 lg:self-start'>
            <div className='bg-background/60 border-border overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm'>
              <div className='space-y-2 p-2'>
                {tabs.map(({ value, label, icon }) => (
                  <Button
                    key={value}
                    onClick={() => navigate({ search: { tab: value } })}
                    variant={tab === value ? "primary" : "ghost"}
                    className={`group relative w-full justify-start gap-3 ${
                      tab === value ? "shadow-md" : ""
                    }`}
                  >
                    <Icon
                      icon={icon}
                      className={`text-xl transition-transform duration-200 ${
                        tab === value ? "" : "group-hover:scale-110"
                      }`}
                    />
                    <span className='font-medium'>{label}</span>
                    {tab === value && (
                      <div className='bg-primary-foreground/20 absolute right-2 h-2 w-2 rounded-full' />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className='bg-background/60 border-border rounded-xl border p-8 shadow-sm backdrop-blur-sm lg:p-10'>
            <ActivePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
