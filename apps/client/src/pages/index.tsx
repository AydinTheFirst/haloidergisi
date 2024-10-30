import { Loader } from "@/components/Loader";
import { useHTTP } from "@/hooks";
import { HomeLayout } from "@/layouts/Home/Layout";
import { Logo } from "@/layouts/Home/Logo";
import { CDN, sleep } from "@/lib";
import { navbarHeightSignal } from "@/lib/signals";
import { ICategory, IMagazine } from "@/types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import { Key } from "react";
import { useNavigate } from "react-router-dom";

export const App = () => {
  return (
    <HomeLayout>
      <Landing />
      <Categories />
    </HomeLayout>
  );
};

export default App;

const SearchMagazines = () => {
  const { data: magazines } = useHTTP<any[]>("/magazines");

  const handleSelect = (val: Key) => {
    location.replace(`/magazines/${val}`);
  };

  if (!magazines) return <Loader />;

  return (
    <>
      <Autocomplete
        size="sm"
        label="Dergilerde Ara"
        className="max-w-xs"
        variant="underlined"
        onSelectionChange={handleSelect as any}
      >
        {magazines.map((magazine) => (
          <AutocompleteItem
            key={magazine.id}
            value={magazine.title}
            nonce="Sonuç bulunamadı!"
            textValue={magazine.title}
          >
            <div className="flex items-center gap-3">
              <Image
                className="h-10 rounded-none"
                src={CDN + magazine.thumbnail}
                alt={magazine.title}
              />
              <span>{magazine.title}</span>
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </>
  );
};

const Landing = () => {
  const divStyle: React.CSSProperties = {
    backgroundImage: `url(/banner.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100dvh",
    zIndex: -1,
  };

  const scrollSmooth = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  console.log(navbarHeightSignal.value);
  return (
    <>
      <div style={divStyle} className="shadow-hero"></div>

      <div className="absolute bottom-0 w-full">
        <div className="flex h-full items-end justify-center pb-5">
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <Logo />
            </div>
            <SearchMagazines />
            <Button
              color="warning"
              size="sm"
              onPress={scrollSmooth}
              className="z-50"
            >
              Dergileri Keşfet
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          height: `calc(100dvh - ${navbarHeightSignal.value}px)`,
        }}
      />
    </>
  );
};

const Categories = () => {
  const { data: categories } = useHTTP<ICategory[]>("/categories");

  if (!categories) return <Loader />;

  return categories.map((category, i) => (
    <CategorySection key={i} category={category} />
  ));
};

const CategorySection = ({ category }: { category: ICategory }) => {
  const { data: magazines } = useHTTP<IMagazine[]>(
    `/categories/${category.id}/magazines`,
  );

  if (!magazines) return <Loader />;

  return (
    <>
      <div
        className={`py-16 backdrop-blur-sm`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container">
          <h1 className="mb-3 text-3xl font-bold">{category.title}</h1>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {magazines.reverse().map((magazine: IMagazine, i) => (
              <MagazineCard key={i} magazine={magazine} />
            ))}
          </div>
        </div>
      </div>

      <Divider className="my-10" />
    </>
  );
};

const MagazineCard = ({ magazine }: { magazine: IMagazine }) => {
  const navigate = useNavigate();
  const handlePress = async () => {
    await sleep(200);
    navigate(`/magazines/${magazine.id}`);
  };

  return (
    <Card
      id={magazine.id}
      isPressable
      onPress={handlePress}
      className="bg-[#F8EFD0]"
    >
      <Image src={CDN + magazine.thumbnail} alt={magazine.title} />
      <CardFooter className="justify-between text-small">
        <b>{magazine.title}</b>
      </CardFooter>
    </Card>
  );
};
