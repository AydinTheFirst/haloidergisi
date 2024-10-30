import { HomeLayout } from "@/layouts/Home/Layout";
import { UsersTable } from "./users";
import { CategoryTable } from "./categories";
import { MagazineTable } from "./magazines";
import { Tabs, Tab, Button, ButtonGroup } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { Key, useEffect, useState } from "react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, []);

  const handleTabChange = (key: Key) => {
    setActiveTab(key.toString());
    navigate(`/dashboard?tab=${key}`);
  };

  const activeTabComponent = () => {
    switch (activeTab) {
      case "users":
        return <UsersTable />;
      case "categories":
        return <CategoryTable />;
      case "magazines":
        return <MagazineTable />;
      default:
        return <UsersTable />;
    }
  };

  return (
    <HomeLayout>
      <div className="container my-10 grid grid-cols-12 gap-3">
        <div className="col-span-12 flex justify-start md:col-span-6">
          <Tabs selectedKey={activeTab} onSelectionChange={handleTabChange}>
            <Tab key={"users"} title="Users" />
            <Tab key={"categories"} title="Categories" />
            <Tab key={"magazines"} title="Magazines" />
          </Tabs>
        </div>

        <div className="col-span-12 flex justify-end md:col-span-6">
          <ButtonGroup>
            <Button as={Link} to={"/dashboard/users/new"}>
              Add User
            </Button>
            <Button as={Link} to={"/dashboard/categories/new"}>
              Add Category
            </Button>
            <Button as={Link} to={"/dashboard/magazines/new"}>
              Add Magazine
            </Button>
          </ButtonGroup>
        </div>

        <div className="col-span-12">{activeTabComponent()}</div>
      </div>
    </HomeLayout>
  );
};

export default Dashboard;
