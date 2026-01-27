import { Button, ButtonGroup } from "@adn-ui/react";
import { useRouter } from "@tanstack/react-router";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();

  return (
    <div className='mt-8 flex items-center justify-center'>
      <ButtonGroup aria-label='Pagination'>
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;

          return (
            <Button
              variant={isActive ? "primary" : "outline"}
              key={page}
              // @ts-ignore
              onClick={() => router.navigate({ search: (old) => ({ ...old, page }) })}
            >
              {page}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
