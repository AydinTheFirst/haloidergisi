import { Loader } from "@/components/Loader";
import { Wrapper } from "@/components/Wrapper";
import { useHTTP } from "@/hooks";
import { CDN, http, httpError } from "@/lib";
import { ICategory, IMagazine } from "@/types";
import {
  Button,
  Input,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { AxiosProgressEvent } from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export const Magazines = () => {
  const { magazineId } = useParams<{ magazineId: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: magazine, isLoading } = useHTTP<IMagazine>(
    magazineId !== "new" ? `/magazines/${magazineId}` : "",
  );

  const { data: categories } = useHTTP<ICategory[]>("/categories");

  const handleProgressChange = (progressEvent: AxiosProgressEvent) => {
    const percent = Math.round(
      (progressEvent.loaded / progressEvent.total!) * 100,
    );
    setUploadProgress(percent);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setUploadProgress(1);
    try {
      magazine
        ? await http.put(`/magazines/${magazineId}`, data, {
            onUploadProgress: handleProgressChange,
          })
        : await http.post("/magazines", data, {
            onUploadProgress: handleProgressChange,
          });
      toast.success(magazine ? "Magazine updated" : "Magazine created");
      setUploadProgress(0);
    } catch (error) {
      httpError(error);
    }
  };

  //5042f298-ad3c-4a9e-91bd-ab727197e2de

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setSelectedImage(reader.result as string);
  };

  if (isLoading || !categories) return <Loader />;

  if (uploadProgress > 0 && uploadProgress < 100) {
    return (
      <Wrapper>
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold">Rana bekle yükleniyor...</h1>
          <Progress showValueLabel value={uploadProgress} isStriped />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="mb-3">
        <Button as={Link} to={"/dashboard?tab=magazines"} variant="light">
          <strong>← Back</strong>
        </Button>
      </div>
      <div>
        <h1 className="mb-3 text-center text-3xl font-bold">
          {magazine ? "Update" : "Create"} Magazine
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="row g-3">
        <Input
          label="Title"
          type="text"
          name="title"
          defaultValue={magazine?.title}
          className="col-md-6"
        />

        <Select
          label="Category"
          name="categoryId"
          defaultSelectedKeys={[magazine?.categoryId || ""]}
          className="col-md-6"
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Status"
          name="status"
          defaultSelectedKeys={[magazine?.status || "draft"]}
          className="col-md-6"
        >
          <SelectItem key={"draft"} value="draft">
            Draft
          </SelectItem>
          <SelectItem key={"published"} value="published">
            Published
          </SelectItem>
        </Select>

        <Textarea
          label="Description"
          name="description"
          defaultValue={magazine?.description}
          className="col-12"
        />

        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-blue-500">
            {magazine ? "Update" : "Upload"} Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleImageChange}
          />

          {magazine && (
            <img
              src={selectedImage || CDN + magazine.thumbnail}
              alt={magazine.title}
              className="mt-3 h-20 w-20 rounded-lg"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-blue-500">
            {magazine ? "Update" : "Upload"} PDF
          </label>
          <input type="file" name="file" accept="application/pdf" />
          {magazine && (
            <Link to={CDN + magazine.file} target="_blank" rel="noreferrer">
              <Button color="success">View PDF</Button>
            </Link>
          )}
        </div>

        <div>
          <Button type="submit" color="secondary" fullWidth>
            {magazine ? "Update" : "Create"} Magazine
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Magazines;
