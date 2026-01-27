import { Avatar, Dialog } from "@adn-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

import apiClient from "@/lib/api-client";
import { Crew, List, User } from "@/types";
import { getCdnUrl } from "@/utils/cdn";

export const Route = createFileRoute("/_landing/team")({
  component: RouteComponent,
  loader: async () => {
    const { data: crews } = await apiClient.get<List<Crew>>("/crews");

    return {
      crews: {
        ...crews,
        items: crews.items.sort((a, b) => a.sort - b.sort),
      },
    };
  },
});

function RouteComponent() {
  const { crews } = Route.useLoaderData();

  return (
    <section className='container py-20'>
      <h2 className='text-3xl font-bold'>Ekibimiz</h2>
      <p className='text-muted-foreground'>
        HALO ekibini burada bulabilir ve kartlara tıklayarak kişiler hakkında daha fazla bilgi
        edinebilirsiniz!
      </p>
      <br />

      <div className='space-y-20'>
        {crews.items.map((crew) => (
          <div key={crew.id}>
            <h3 className='mb-4 text-2xl font-semibold'>{crew.name}</h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {crew.users?.map((user) => (
                <UserCard
                  key={user.id}
                  {...user}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function UserCard(user: User) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <motion.div whileHover={{ scale: 1.05 }}>
          <button className='bg-surface text-surface-foreground w-full rounded p-4'>
            <div className='flex items-center gap-2'>
              <Avatar.Root>
                <Avatar.Image src={getCdnUrl(user.profile?.avatarUrl as string)} />
                <Avatar.Fallback>{user.profile?.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
              </Avatar.Root>
              <div className='text-left'>
                <div className='text-lg font-medium'>{user.profile?.name}</div>
                <div className='text-muted-foreground text-sm'>{user.profile?.title}</div>
              </div>
            </div>
          </button>
        </motion.div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Content className='max-w-md space-y-4'>
            <div className='flex items-center gap-4'>
              <Avatar.Root size='lg'>
                <Avatar.Image src={getCdnUrl(user.profile?.avatarUrl as string)} />
                <Avatar.Fallback>{user.profile?.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
              </Avatar.Root>
              <div className='text-left'>
                <div className='text-2xl font-medium'>{user.profile?.name}</div>
                <div className='text-muted-foreground text-sm'>{user.profile?.title}</div>
              </div>
            </div>
            {user.profile?.bio && <p>{user.profile.bio}</p>}
            <div className='flex justify-end gap-2'>
              {user.profile?.website && (
                <a
                  className='link'
                  href={user.profile?.website}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Website
                </a>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
