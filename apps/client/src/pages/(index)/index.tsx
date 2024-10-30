import { Button, Card, CardFooter, Divider, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Loader, Logo } from "@/components";
import { Category, Post } from "@/types";
import { getFileUrl, sleep } from "@/utils";

const Index = () => {
  return (
    <div className="grid gap-10">
      <Hero />
      <Categories />
    </div>
  );
};

export default Index;

const Hero = () => {
  return (
    <>
      <img
        alt="Banner"
        className="fixed left-0 top-0 -z-10 h-full w-full object-cover"
        src="/banner.png"
      />
      <div className="flex h-[80vh] flex-col items-center justify-end gap-3">
        <Logo className="h-20 w-auto md:h-40" />
        <Button color="secondary" size="lg">
          <strong>Dergileri Keşfet</strong>
        </Button>
      </div>
    </>
  );
};

const Categories = () => {
  const { data: categories } = useSWR<Category[]>("/categories");

  if (!categories) return <Loader />;

  return categories.map((category, i) => (
    <CategorySection category={category} key={i} />
  ));
};

const CategorySection = ({ category }: { category: Category }) => {
  const { data: magazines } = useSWR<Post[]>(
    `/categories/${category.id}/posts`,
  );

  if (!magazines) return <Loader />;

  return (
    <>
      <div className="container">
        <h1 className="mb-3 text-3xl font-bold">{category.title}</h1>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {magazines.reverse().map((magazine: Post, i) => (
            <MagazineCard key={i} magazine={magazine} />
          ))}
        </div>
      </div>

      <Divider className="my-10" />
    </>
  );
};

const MagazineCard = ({ magazine }: { magazine: Post }) => {
  const navigate = useNavigate();
  const handlePress = async () => {
    await sleep(350);
    navigate(`/post/${magazine.id}`);
  };

  return (
    <Card
      className="bg-[#F8EFD0]"
      id={magazine.id}
      isPressable
      onPress={handlePress}
    >
      <Image alt={magazine.title} src={getFileUrl(magazine.cover!)} />
      <CardFooter className="justify-between text-small">
        <b>{magazine.title}</b>
      </CardFooter>
    </Card>
  );
};
