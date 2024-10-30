import { Loader } from "@/components/Loader";
import { Wrapper } from "@/components/Wrapper";
import { useHTTP } from "@/hooks";
import { http, httpError } from "@/lib";
import { ICategory } from "@/types";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";

export const Categories = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: category, isLoading } = useHTTP<ICategory>(
    categoryId !== "new" ? `/categories/${categoryId}` : "",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));

    try {
      category
        ? await http.put(`/categories/${categoryId}`, data)
        : await http.post("/categories", data);
      toast.success(category ? "Category updated" : "Category created");
    } catch (error) {
      httpError(error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Wrapper>
      <div className="mb-3">
        <Button as={Link} to={"/dashboard?tab=categories"} variant="light">
          <strong>← Back</strong>
        </Button>
      </div>
      <div>
        <h1 className="mb-3 text-center text-3xl font-bold">
          {category ? "Update" : "Create"} Category
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="row g-3">
        <Input
          label="Name"
          type="text"
          name="title"
          defaultValue={category?.title}
          className="col-md-6"
        />

        <Textarea
          label="Description"
          name="description"
          defaultValue={category?.description}
          className="col-md-6"
        />

        <div className="col-12">
          <Button type="submit" color="secondary" fullWidth>
            {category ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Categories;
