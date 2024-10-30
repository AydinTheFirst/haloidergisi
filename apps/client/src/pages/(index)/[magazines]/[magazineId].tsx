import { Button, Image, Link } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Loader } from "@/components";
import { Post } from "@/types";
import { getFileUrl } from "@/utils";

const ViewMagazine = () => {
  const { magazineId } = useParams<{ magazineId: string }>();
  const { data: magazine } = useSWR<Post>(`/posts/${magazineId}`);

  if (!magazine) return <Loader />;

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-6">
        <div className="grid gap-5">
          <h2 className="text-3xl font-extrabold">{magazine.title}</h2>
          <p className="text-lg font-bold">{magazine.description}</p>
          <Button
            as={Link}
            color="secondary"
            href={getFileUrl(magazine.file!)}
            isExternal
            size="sm"
          >
            <strong>Dergiyi Göster</strong>
          </Button>
        </div>
      </div>
      <div className="col-span-12 grid place-items-center md:col-span-6">
        <Image
          alt="Magazine"
          className="h-96 w-full object-cover"
          src={getFileUrl(magazine.cover!)}
        />
      </div>
    </div>
  );
};

export default ViewMagazine;
