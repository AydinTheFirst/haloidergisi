import { Loader } from "@/components/Loader";
import { useHTTP } from "@/hooks";
import { HomeLayout } from "@/layouts/Home/Layout";
import { CDN } from "@/lib";
import { Button, Link } from "@nextui-org/react";
import { useParams } from "react-router-dom";

export const GetMagazine = () => {
  const magazineId = useParams<{ magazineId: string }>().magazineId;
  const { data: magazine } = useHTTP<any>(`/magazines/${magazineId}`);

  if (!magazine) return <Loader />;

  return (
    <>
      <HomeLayout>
        <div className="container my-10">
          <div>
            <Link href="/" color="foreground">
              ← Geri Dön
            </Link>
          </div>
          <br />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="order-1 flex items-center md:-order-1">
              <div>
                <h1 className="mb-3 text-3xl font-bold">{magazine.title}</h1>
                <p className="text-lg">{magazine.description}</p>
                <br />
                <div className="flex items-center gap-3">
                  <Button
                    color="warning"
                    as={Link}
                    href={CDN + magazine.file}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="shadow"
                    fullWidth
                  >
                    Dergiyi Görüntüle
                  </Button>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage: `url(${CDN + magazine.thumbnail})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "300px",
                width: "100%",
              }}
            />
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default GetMagazine;
