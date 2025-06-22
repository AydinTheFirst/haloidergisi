import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@heroui/react";
import { LucideBug } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Oops!";
  let details = "An unexpected error occurred.";
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
    <>
      <main className='container max-w-3xl'>
        <div className='grid h-screen place-items-center'>
          <div className='grid gap-3'>
            <Image
              className='h-96'
              src='/error.svg'
            />
            <h1 className='text-center text-3xl font-bold'>{message}</h1>
            <p className='text-muted text-center text-lg'>{details}</p>
            <Link
              className='mx-auto'
              color='foreground'
              href='/'
            >
              Anasayfaya Dön
            </Link>
          </div>
        </div>
      </main>

      {stack && <StackMessageModal stack={stack} />}
    </>
  );
}

function StackMessageModal({ stack }: { stack: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Button
        className='fixed right-4 bottom-4 z-50'
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideBug />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior='inside'
        size='5xl'
      >
        <ModalContent>
          <ModalHeader>Stack Trace</ModalHeader>
          <ModalBody>
            <pre className='break-words whitespace-pre-wrap'>
              {stack?.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </pre>
          </ModalBody>
          <ModalFooter>
            <Button
              className='mt-4'
              onPress={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
