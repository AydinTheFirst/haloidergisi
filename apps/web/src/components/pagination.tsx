import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();

  return (
    <div className='mt-8 flex items-center justify-center'>
      <div
        className='flex items-center gap-1'
        aria-label='Pagination'
      >
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;

          return (
            <Button
              variant={isActive ? "default" : "outline"}
              key={page}
              size='sm'
              // @ts-ignore
              onClick={() => router.navigate({ search: (old) => ({ ...old, page }) })}
            >
              {page}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
