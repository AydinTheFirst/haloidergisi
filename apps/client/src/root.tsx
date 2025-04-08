import type { Route } from "@react-router/src/+types/root";

import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from "@heroui/react";
import { LucideXOctagon } from "lucide-react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "react-router";

import "@/styles/globals.css";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred. Please try again later.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='container grid h-screen place-items-center'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='justify-center gap-3'>
          <LucideXOctagon className='h-10 w-10 text-red-500' />
          <h1 className='text-center text-2xl font-bold'>
            {message === "404" ? "Sayfa Bulunamadı" : "Bir Hata Oluştu"}
          </h1>
          <LucideXOctagon className='h-10 w-10 text-red-500' />
        </CardHeader>
        <CardBody>
          <h1 className='text-center text-4xl font-bold'>{message}</h1>
          <p className='text-center'>{details}</p>
          {stack && (
            <Accordion>
              <AccordionItem
                aria-label='error'
                key='error'
                title='Hata Detayları'
              >
                <pre className='w-full overflow-x-auto p-4'>
                  <code>{details}</code>
                </pre>
              </AccordionItem>
            </Accordion>
          )}
        </CardBody>
        <CardFooter>
          <Button
            as={Link}
            color='secondary'
            fullWidth
            to='/'
          >
            Anasayfaya Dön
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='tr'>
      <head>
        <meta charSet='UTF-8' />
        <meta
          content='width=device-width, initial-scale=1.0'
          name='viewport'
        />
        <link
          href='/logo.png'
          rel='shortcut icon'
          type='image/x-icon'
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
