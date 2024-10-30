import { Request, Response } from "express";
const squads = [
  {
    id: "f1df1cd0-91f6-4abc-81d8-ae233fd97547",
    name: "Yönetim",
  },
  {
    id: "763cba3b-98a7-4816-bc8d-6fc0d1f279f5",
    name: "Yazarlar",
  },
  {
    id: "0de7fd13-3f31-4e12-800a-775e77b079f6",
    name: "Tasarım Ekibi",
  },
  {
    id: "f1df1cd0-91f6-4abc-81d8-ae233fd97548",
    name: "Website Yönetimi",
  },
];

class SquadController {
  get(req: Request, res: Response) {
    res.send(squads);
  }

  getOne(req: Request, res: Response) {
    const id = req.params.id;
    const squad = squads.find((squad) => squad.id === id);
    res.send(squad);
  }
}

export default new SquadController();
