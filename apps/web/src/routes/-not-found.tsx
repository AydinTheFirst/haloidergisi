import { Button } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className='bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <div className='flex max-w-md flex-col items-center gap-6'>
        <div className='bg-muted flex h-24 w-24 items-center justify-center rounded-full'>
          <Icon
            icon='mdi:alert-circle-outline'
            className='text-muted-foreground h-12 w-12'
          />
        </div>

        <div className='space-y-2'>
          <h1 className='text-4xl font-bold tracking-tight'>404</h1>
          <h2 className='text-2xl font-semibold tracking-tight'>Sayfa Bulunamadı</h2>
          <p className='text-muted-foreground'>
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <Link to='/'>
          <Button
            size='lg'
            className='gap-2'
          >
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
