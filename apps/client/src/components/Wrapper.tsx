import { HomeLayout } from "@/layouts/Home/Layout";

export const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <HomeLayout>
    <main className="container my-10">
      <div className="mx-auto max-w-2xl">{children}</div>
    </main>
  </HomeLayout>
);
