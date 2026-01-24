import { Button, ButtonGroup } from "@adn-ui/react";
import { Link } from "@tanstack/react-router";

interface PaginationProps {
  fullPath: string;
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, fullPath, currentPage }: PaginationProps) {
  return (
    <div className='mt-8 flex items-center justify-center'>
      <ButtonGroup aria-label='Pagination'>
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          const isActive = page === currentPage;

          return (
            <Button
              render={
                <Link
                  to={fullPath}
                  search={(old) => ({ ...old, page })}
                />
              }
              variant={isActive ? "primary" : "outline"}
              key={page}
            >
              {page}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}
