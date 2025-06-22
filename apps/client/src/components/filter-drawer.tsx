import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  useDisclosure
} from "@heroui/react";
import { LucideFilter } from "lucide-react";
import { useSearchParams } from "react-router";

export default function FilterDrawer() {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = Object.fromEntries(formData.entries());
    searchParams.forEach((_, key) => searchParams.delete(key));

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, String(value));
      }
    });

    searchParams.set("page", "1");

    setSearchParams(searchParams);
    onClose();
  };

  return (
    <>
      <Button
        isIconOnly
        onPress={onOpen}
        variant='light'
      >
        <LucideFilter />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-1'>
            <h2 className='font-semibold'>Filtreleme</h2>
          </DrawerHeader>
          <DrawerBody>
            <form
              className='grid gap-3'
              onSubmit={handleSubmit}
            >
              <Input
                defaultValue={searchParams.get("search") || ""}
                isClearable
                label='Ara...'
                name='search'
              />

              <Button
                color='primary'
                type='submit'
              >
                Filtrele
              </Button>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color='danger'
              onPress={() => setSearchParams({})}
              variant='light'
            >
              Filtreleri Temizle
            </Button>
            <Button
              color='danger'
              onPress={onClose}
              variant='light'
            >
              Kapat
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
