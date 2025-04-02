import { BookCheck, Home, Newspaper, Presentation, Users } from "lucide-react";

export const sidebarItems = [
  {
    canCreate: false,
    href: "/dashboard",
    icon: Home,
    label: "Yönetim Paneli",
  },
  {
    canCreate: true,
    href: "/dashboard/users",
    icon: Users,
    label: "Kullanıcılar",
  },
  {
    canCreate: true,
    href: "/dashboard/categories",
    icon: BookCheck,
    label: "Katagoriler",
  },
  {
    canCreate: true,
    href: "/dashboard/posts",
    icon: Presentation,
    label: "Dergiler",
  },
  {
    canCreate: true,
    href: "/dashboard/squads",
    icon: Users,
    label: "Takımlar",
  },
  {
    canCreate: true,
    href: "/dashboard/news",
    icon: Newspaper,
    label: "Haberler",
  },
];
